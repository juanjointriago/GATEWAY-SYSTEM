import { useUserStore } from "../../stores";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";
import { useEffect } from "react";
import { progressSheetInterface } from "../../interface";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import {v6 as uuid} from'uuid'

interface Props {
    studentID: string;
}

type FormData = {
  inscriptionDate: string;
  expirationDate: string;
  myPreferredName: string;
  otherContacts: string;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalDiscount: number;
  totalBalance: number;
  quotesQty: number;
};

export const StudentContract = ({ studentID }: Props) => {
  const getStudentById = useUserStore((state) => state.getUserById);
  const getProgressSheetByStudentId = useProgressSheetStore((state) => state.getProgressSheetByStudentId);
  const createProgressSheet = useProgressSheetStore((state) => state.createProgressSheet);
  const updateProgressSheet = useProgressSheetStore((state) => state.updateProgressSheet);
  
  const student = getStudentById(studentID);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      inscriptionDate: '',
      expirationDate: '',
      myPreferredName: '',
      otherContacts: '',
      totalFee: 0,
      totalPaid: 0,
      totalDue: 0,
      totalDiscount: 0,
      totalBalance: 0,
      quotesQty: 0,
    },
    mode: 'onChange'
  });

  // Watch valores para cálculos automáticos
  const totalFee = watch('totalFee');
  const totalPaid = watch('totalPaid');
  const totalDiscount = watch('totalDiscount');

  // Efecto para calcular automáticamente valores derivados
  useEffect(() => {
    const totalDue = Number(totalFee || 0) - Number(totalPaid || 0) - Number(totalDiscount || 0);
    setValue('totalDue', totalDue);
    setValue('totalBalance', totalDue);
  }, [totalFee, totalPaid, totalDiscount, setValue]);

  useEffect(() => {
    if (!student) return;

    const initializeProgressSheet = async () => {
      try {
        const progressSheet = getProgressSheetByStudentId(studentID);
        console.log('Progress Sheet current:', progressSheet?.uid);
        
        if (!progressSheet) {
          console.debug("no hay uuid")
          const uid = uuid();
          // Crear progresssheet con datos iniciales
          const newProgressSheet: progressSheetInterface = {
            uid: uid,
            id: uid,
            inscriptionDate: new Date().toISOString().split('T')[0],
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            myPreferredName: student.name || "",
            otherContacts: "",
            progressClasses: [],
            totalFee: 0,
            totalPaid: 0,
            totalDue: 0,
            totalDiscount: 0,
            totalBalance: 0,
            quotesQty: 0,
            studentId: studentID,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await createProgressSheet(newProgressSheet);
          
          // Actualizar el formulario con los nuevos datos
          reset({
            inscriptionDate: newProgressSheet.inscriptionDate,
            expirationDate: newProgressSheet.expirationDate,
            myPreferredName: newProgressSheet.myPreferredName,
            otherContacts: newProgressSheet.otherContacts,
            totalFee: newProgressSheet.totalFee || 0,
            totalPaid: newProgressSheet.totalPaid || 0,
            totalDue: newProgressSheet.totalDue || 0,
            totalDiscount: newProgressSheet.totalDiscount || 0,
            totalBalance: newProgressSheet.totalBalance || 0,
            quotesQty: newProgressSheet.quotesQty || 0,
          });
        } else {
          // Cargar datos existentes
          reset({
            inscriptionDate: progressSheet.inscriptionDate ? progressSheet.inscriptionDate.split('T')[0] : '',
            expirationDate: progressSheet.expirationDate ? progressSheet.expirationDate.split('T')[0] : '',
            myPreferredName: progressSheet.myPreferredName || '',
            otherContacts: progressSheet.otherContacts || '',
            totalFee: progressSheet.totalFee || 0,
            totalPaid: progressSheet.totalPaid || 0,
            totalDue: progressSheet.totalDue || 0,
            totalDiscount: progressSheet.totalDiscount || 0,
            totalBalance: progressSheet.totalBalance || 0,
            quotesQty: progressSheet.quotesQty || 0,
          });
        }
      } catch (error) {
        console.error('Error al inicializar progress sheet:', error);
        Swal.fire({
          title: 'Info',
          text: 'Creando Registro del contrato en Cero',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      }
    };

    initializeProgressSheet();
  }, [studentID, student, getProgressSheetByStudentId, createProgressSheet, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const progressSheet = getProgressSheetByStudentId(studentID);
      const dataToSave = {
        ...data,
        studentId: studentID,
        updatedAt: Date.now(),
        inscriptionDate: data.inscriptionDate + 'T00:00:00.000Z',
        expirationDate: data.expirationDate + 'T23:59:59.999Z',
        progressClasses: progressSheet?.progressClasses || [],
      };

      if (progressSheet?.id) {
        await updateProgressSheet({ ...dataToSave, id: progressSheet.id } as progressSheetInterface);
      } else {
        await createProgressSheet({ ...dataToSave, createdAt: Date.now() } as progressSheetInterface);
      }

      Swal.fire({
        title: '¡Éxito!',
        text: 'Los datos del contrato han sido guardados correctamente',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al guardar los datos',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleClearForm = () => {
    reset({
      inscriptionDate: '',
      expirationDate: '',
      myPreferredName: '',
      otherContacts: '',
      totalFee: 0,
      totalPaid: 0,
      totalDue: 0,
      totalDiscount: 0,
      totalBalance: 0,
      quotesQty: 0,
    });
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium">
            No se encontró el estudiante
          </div>
          <div className="text-gray-500 mt-2">
            ID: {studentID}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header con información del estudiante */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {student.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">CC: {student.cc}</p>
            <p className="text-sm text-gray-600">Email: {student.email}</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Información del Contrato
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Apoderado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Representante *
              </label>
              <Controller
                name="myPreferredName"
                control={control}
                rules={{
                  required: "El Nombre del Representante es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.myPreferredName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el nombre de Representante"
                  />
                )}
              />
              {errors.myPreferredName && (
                <p className="mt-1 text-sm text-red-600">{errors.myPreferredName.message}</p>
              )}
            </div>

            {/* Otros Contactos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otros Contactos
              </label>
              <Controller
                name="otherContacts"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Contactos adicionales (opcional)"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Fecha de Inscripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inscripción *
              </label>
              <Controller
                name="inscriptionDate"
                control={control}
                rules={{
                  required: "La fecha de inscripción es requerida"
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.inscriptionDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.inscriptionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.inscriptionDate.message}</p>
              )}
            </div>

            {/* Fecha de Expiración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Expiración *
              </label>
              <Controller
                name="expirationDate"
                control={control}
                rules={{
                  required: "La fecha de expiración es requerida",
                  validate: (value) => {
                    const inscriptionDate = watch('inscriptionDate');
                    if (inscriptionDate && value) {
                      const inscription = new Date(inscriptionDate);
                      const expiration = new Date(value);
                      
                      if (expiration <= inscription) {
                        return "La fecha de expiración debe ser posterior a la de inscripción";
                      }
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.expirationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.expirationDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Información Financiera
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Adeudado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Adeudado ($)
              </label>
              <Controller
                name="totalFee"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "El total adeudado no puede ser negativo"
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.totalFee ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.totalFee && (
                <p className="mt-1 text-sm text-red-600">{errors.totalFee.message}</p>
              )}
            </div>

            {/* Total Pagado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pagado ($)
              </label>
              <Controller
                name="totalPaid"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "El total pagado no puede ser negativo"
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.totalPaid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.totalPaid && (
                <p className="mt-1 text-sm text-red-600">{errors.totalPaid.message}</p>
              )}
            </div>

            {/* Total Descuento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Descuento ($)
              </label>
              <Controller
                name="totalDiscount"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "El total descuento no puede ser negativo"
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0.00"
                  />
                )}
              />
              {errors.totalDiscount && (
                <p className="mt-1 text-sm text-red-600">{errors.totalDiscount.message}</p>
              )}
            </div>

            {/* Cantidad de Cuotas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Cuotas
              </label>
              <Controller
                name="quotesQty"
                control={control}
                rules={{
                  min: {
                    value: 1,
                    message: "La cantidad de cuotas debe ser mayor a 0"
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.quotesQty ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                )}
              />
              {errors.quotesQty && (
                <p className="mt-1 text-sm text-red-600">{errors.quotesQty.message}</p>
              )}
            </div>

            {/* Total Pendiente (Calculado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pendiente ($)
              </label>
              <Controller
                name="totalDue"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Calculado automáticamente</p>
            </div>

            {/* Total Saldo (Calculado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Saldo ($)
              </label>
              <Controller
                name="totalBalance"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-500">Calculado automáticamente</p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </div>
            ) : (
              'Guardar Contrato'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClearForm}
            className="flex-1 sm:flex-none sm:px-8 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
