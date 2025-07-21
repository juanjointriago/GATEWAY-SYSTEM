/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { generateInvoiceNumber } from "../../../helpers/invoice.helper";
import CustomModal from "../../../components/CustomModal";
import { fee } from "../../../interface/fees.interface";
import { useUserStore } from "../../../stores";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useFeesStore } from "../../../stores/fees/fess.store";
import { useProgressSheetStore } from "../../../stores/progress-sheet/progresssheet.store";
import { useAuthStore } from "../../../stores/auth/auth.store";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v6 as uuid } from "uuid";
import { sendCustomEmail } from "../../../store/firebase/helper";
import QRCode from "qrcode";


export const AddFeeForm = () => {
  const getUserByRole = useUserStore((state) => state.getUserByRole);
  const createFee = useFeesStore((state) => state.createFee);
  const { user } = useAuthStore();
  const { getProgressSheetByStudentId } = useProgressSheetStore();
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalTitle, setCustomModalTitle] = useState('');
  const [customModalMessage, setCustomModalMessage] = useState('');
  const [customModalType, setCustomModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
  const [customModalAction, setCustomModalAction] = useState<() => void>(() => {});
  const students = getUserByRole("student").filter(
    (student) => student.isActive
  )!;
  //fPJoZWFmWRgjB3LBToRo7wwhLuH3
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const getUserById = useUserStore((state) => state.getUserById);
  const [isUploading, setIsUploading] = useState(false);

  // Definir las opciones de pago según el rol del usuario
  const getPaymentOptions = () => {
    if (user?.role === 'student') {
      return [
        { value: 'deposit', label: 'Depósito' },
        { value: 'transference', label: 'Transferencia' },
        { value: 'voucher_tc', label: 'Voucher TC' }
      ];
    } else {
      return [
        { value: 'cash', label: 'Efectivo' },
        { value: 'transference', label: 'Transferencia' },
        { value: 'tc', label: 'Tarjeta de crédito' },
        { value: 'deposit', label: 'Depósito' }
      ];
    }
  };

  // Función para determinar si se requiere selección de estudiante
  const isStudentSelectionRequired = () => {
    if (!user) return true;
    return user.role === 'admin' || user.role === 'teacher';
  };

  const paymentOptions = getPaymentOptions();

  const today = Date.now();
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<fee>({
    defaultValues: {
      studentUid: user?.role === 'student' ? user.id : "",
      qty: 0,
      createdAt: today,
      updatedAt: today,
      code: generateInvoiceNumber(),
      isActive: true,
      isSigned: false,
      reason: "",
      paymentMethod: user?.role === 'student' ? "deposit" : "cash",
      place: "",
      docNumber: "",
      customerName: "",
      imageUrl: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const selectedStudentUid = watch("studentUid");

  // Effect para autocompletar el nombre del representante
  useEffect(() => {
    const studentUid = user?.role === 'student' ? user.id : selectedStudentUid;
    
    if (studentUid) {
      const progressSheet = getProgressSheetByStudentId(studentUid);
      if (progressSheet && progressSheet.myPreferredName) {
        setValue('customerName', progressSheet.myPreferredName);
      }
    }
  }, [selectedStudentUid, user, getProgressSheetByStudentId, setValue]);

  // Effect inicial para estudiantes autenticados
  useEffect(() => {
    if (user?.role === 'student' && user.id) {
      const progressSheet = getProgressSheetByStudentId(user.id);
      if (progressSheet && progressSheet.myPreferredName) {
        setValue('customerName', progressSheet.myPreferredName);
      }
    }
  }, [user, getProgressSheetByStudentId, setValue]);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: "#e2e8f0",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    option: (provided: any, state: { isSelected: any }) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4299e1" : "#0000",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: state.isSelected ? "#4299e1" : "white",
      },
    }),
  };

  const onSubmit = async (fee: fee) => {
    try {
      const studentUid = user?.role === 'student' ? user.id : fee.studentUid;
      
      if (!studentUid) {
        showModal('Error', 'Por favor seleccione un estudiante', 'danger');
        return;
      }

      const student = getUserById(studentUid);
      if (!student) {
        showModal('Error', 'No se encontró un estudiante con ese UID', 'danger');
        return;
      }

      // Validar imagen solo si no es efectivo
      if (paymentMethod !== "cash" && !selectedFile) {
        showModal('Error', 'Por favor seleccione una imagen del comprobante', 'danger');
        return;
      }

      setIsUploading(true);

      // Buscar el progress sheet del estudiante
      const progressSheet = getProgressSheetByStudentId(studentUid);
      if (!progressSheet) {
        showModal('Error', 'No se encontró un contrato para este estudiante', 'danger');
        setIsUploading(false);
        return;
      }

      // Subir la imagen a Firebase Storage o usar logo para efectivo
      let imageUrl: string | undefined;
      if (paymentMethod === "cash") {
        // Para pagos en efectivo, usar el logo de Gateway
        imageUrl = import.meta.env.VITE_REACT_APP_LOGO_URL || 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd';
      } else if (selectedFile) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${timestamp}-${student.cc}`;
        const storage = getStorage();
        const storageRef = ref(storage, `fees/${fileName}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Crear el objeto fee
      const feeToSave: fee = {
        ...fee,
        studentUid,
        id: uuid(),
        cc: student.cc,
        imageUrl,
      };

      // Al registrar un pago, solo guardar el fee (sin actualizar progressSheet)
      await createFee(feeToSave);

      // Enviar email de notificación
      await sendPaymentNotificationEmail(feeToSave, student, progressSheet);

      // Mostrar mensaje de éxito
      const successMessage = user?.role === 'student'
        ? "El pago se ha registrado correctamente y está pendiente de aprobación"
        : "El pago se ha registrado correctamente y se ha actualizado el contrato";

      showModal('¡Éxito!', successMessage, 'success');

      // Limpiar el formulario
      reset();
      setSelectedFile(null);

      setIsUploading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      showModal('Error', 'Ocurrió un error al guardar el registro', 'danger');
      setIsUploading(false);
    }
  };

  // Función para enviar email de notificación
  const sendPaymentNotificationEmail = async (fee: fee, student: any, progressSheet: any) => {
    try {
      // Crear QR code con información del pago
      const qrData = `Pago: ${fee.code}\nEstudiante: ${student.name}\nMonto: $${fee.qty}\nFecha: ${new Date(fee.createdAt).toLocaleDateString()}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);

      // Plantilla HTML para el email
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${import.meta.env.VITE_REACT_APP_LOGO_URL || 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd'}" 
                 alt="Gateway English" style="max-width: 200px; height: auto;">
          </div>
          
          <h2 style="color: #2563eb; text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Comprobante de Pago
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Detalles del Pago</h3>
            <p><strong>Número de Recibo:</strong> ${fee.code}</p>
            <p><strong>Estudiante:</strong> ${student.name}</p>
            <p><strong>Monto:</strong> $${fee.qty}</p>
            <p><strong>Fecha:</strong> ${new Date(fee.createdAt).toLocaleDateString()}</p>
            <p><strong>Forma de Pago:</strong> ${fee.paymentMethod === 'cash' ? 'Efectivo' : 
              fee.paymentMethod === 'transference' ? 'Transferencia' : 
              fee.paymentMethod === 'deposit' ? 'Depósito' : 
              fee.paymentMethod === 'tc' ? 'Tarjeta de Crédito' : 'Voucher TC'}</p>
            <p><strong>Motivo:</strong> ${fee.reason}</p>
            ${fee.paymentMethod !== 'cash' && fee.docNumber ? `<p><strong>Número de Comprobante:</strong> ${fee.docNumber}</p>` : ''}
          </div>

          ${fee.paymentMethod !== 'cash' && fee.imageUrl ? `
          <div style="text-align: center; margin: 20px 0;">
            <h4 style="color: #1e40af;">Comprobante de Pago</h4>
            <img src="${fee.imageUrl}" alt="Comprobante" style="max-width: 400px; height: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <h4 style="color: #1e40af;">Código QR del Pago</h4>
            <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; height: auto;">
          </div>

          <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1; font-size: 14px; text-align: center;">
              <strong>Gracias por su pago. Este comprobante es válido como evidencia de su transacción.</strong>
            </p>
          </div>
        </div>
      `;

      // Determinar destinatarios
      const recipients = [student.email];
      if (progressSheet.preferredEmail && progressSheet.preferredEmail !== student.email) {
        recipients.push(progressSheet.preferredEmail);
      }

      // Enviar email
      await sendCustomEmail({
        to: recipients,
        message: {
          subject: `Comprobante nro ${fee.code}`,
          text: `Comprobante de pago ${fee.code} por $${fee.qty}`,
          html: htmlTemplate
        }
      });

      console.log('Email de notificación enviado exitosamente');
    } catch (error) {
      console.error('Error enviando email de notificación:', error);
      // No mostrar error al usuario ya que el pago fue registrado exitosamente
    }
  };

  const showModal = (
    title: string,
    message: string,
    type: 'warn' | 'info' | 'danger' | 'success'
  ) => {
    setCustomModalTitle(title);
    setCustomModalMessage(message);
    setCustomModalType(type);
    setCustomModalAction(() => () => setCustomModalOpen(false));
    setCustomModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <CustomModal
        isOpen={customModalOpen}
        title={customModalTitle}
        message={customModalMessage}
        type={customModalType}
        onConfirm={customModalAction}
        onCancel={() => setCustomModalOpen(false)}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
        noValidate={true}
      >
        {/* Grid responsive para organizar los campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Número de recibo */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nro de recibo:
            </label>
            <input 
              type="text" 
              value={generateInvoiceNumber()} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
            />
          </div>

          {/* Selector de estudiante - Solo visible si no es estudiante */}
          {user?.role !== 'student' && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Escoja estudiante
              </label>
              <Controller
                name="studentUid"
                control={control}
                rules={{ required: isStudentSelectionRequired() ? "Por favor escoja un estudiante" : undefined }}
                render={({ field: { onChange, onBlur, ref, name } }) => (
                  <Select
                    name={name}
                    id={name}
                    ref={ref}
                    onBlur={onBlur}
                    options={
                      students &&
                      students.map(
                        (student) =>
                          ({
                            value: student.id,
                            label: `${student.name} - ${student.email}`,
                          } as any)
                      )
                    }
                    isLoading={isLoading}
                    styles={customStyles}
                    isClearable
                    isSearchable
                    placeholder="Buscar Estudiante..."
                    noOptionsMessage={() =>
                      error ? error : "No existen estudiantes con ese nombre."
                    }
                    onChange={(selectedOption) => {
                      onChange(selectedOption ? selectedOption?.value : "");
                    }}
                  />
                )}
              />
              {errors.studentUid && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.studentUid.message}
                </p>
              )}
            </div>
          )}

          {/* Información del estudiante para estudiantes logueados */}
          {user?.role === 'student' && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Estudiante
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {user.name} ({user.email})
              </div>
            </div>
          )}

          {/* Valor */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Valor
            </label>
            <Controller
              name="qty"
              rules={{ 
                required: "Por favor ingrese un valor",
                min: {
                  value: 0.01,
                  message: "El valor debe ser mayor a 0"
                }
              }}
              control={control}
              render={({ field: { onChange, onBlur, ref, name } }) => (
                <input
                  id={name}
                  ref={ref}
                  onBlur={onBlur}
                  type="number"
                  step="0.01"
                  min="0.01"
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              )}
            />
            {errors.qty && (
              <p className="text-red-500 text-xs italic mt-1">{errors.qty.message}</p>
            )}
          </div>

          {/* Lugar */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Lugar
            </label>
            <input
              type="text"
              {...register("place", { required: "El lugar es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el lugar"
            />
            {errors.place && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.place.message}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fecha
            </label>
            <input
              type="date"
              {...register("createdAt", {
                required: "Necesita seleccionar una fecha",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.createdAt && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.createdAt.message}
              </p>
            )}
          </div>

          {/* Cliente / Representante */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cliente / Representante
            </label>
            <input
              type="text"
              {...register("customerName", {
                required: "Nombre del cliente es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el nombre del cliente"
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Motivo del pago */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo del pago
            </label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Por favor seleccione un motivo de pago" }}
              render={({ field: { onChange, value, name, ref } }) => (
                <select
                  id={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un motivo</option>
                  <option value="Abono mensualidad">Abono mensualidad</option>
                  <option value="Pago mensualidad">Pago mensualidad</option>
                  <option value="Pago total programa de inglés">
                    Pago total programa de inglés
                  </option>
                </select>
              )}
            />
            {errors.reason && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Forma de pago */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Forma de pago
            </label>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "Por favor seleccione una forma de pago" }}
              render={({ field: { onChange, value, name, ref } }) => (
                <select
                  id={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {paymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Número de comprobante */}
          {(paymentMethod === "transference" ||
            paymentMethod === "deposit" ||
            paymentMethod === "tc" ||
            paymentMethod === "voucher_tc") && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nro de Comprobante
              </label>
              <input
                type="text"
                {...register("docNumber", {
                  required: "Escribir el Nro de comprobante",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el número de comprobante"
              />
              {errors.docNumber && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors.docNumber.message}
                </p>
              )}
            </div>
          )}

          {/* Subir imagen */}
          {(paymentMethod === "transference" ||
            paymentMethod === "deposit" ||
            paymentMethod === "tc" ||
            paymentMethod === "voucher_tc") && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Suba la imagen de su depósito/transferencia o voucher
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!file.type.startsWith("image/")) {
                      showModal('Error', 'El archivo debe ser una imagen', 'danger');
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      showModal('Error', 'El archivo no debe exceder los 5 MB', 'danger');
                      return;
                    }
                    setSelectedFile(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isUploading}
          >
            {isLoading || isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              "Registrar pago"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
