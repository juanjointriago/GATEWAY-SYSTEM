/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { generateInvoiceNumber } from "../../../helpers/invoice.helper";
import { fee } from "../../../interface/fees.interface";
import { useUserStore } from "../../../stores";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useFeesStore } from "../../../stores/fees/fess.store";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { v6 as uuid } from 'uuid'


export const AddFeeForm = () => {
  //   const { register } = useFormContext();
  const getUserByRole = useUserStore((state) => state.getUserByRole);
  const createFee = useFeesStore((state) => state.createFee);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const students = getUserByRole("student").filter(
    (student) => student.isActive
  )!;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const getUserById = useUserStore((state) => state.getUserById);
  const [isUploading, setIsUploading] = useState(false);

  const today = Date.now();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<fee>({
    defaultValues: {
      studentUid: "",
      qty: 0,
      createdAt: today,
      updatedAt: today,
      code: generateInvoiceNumber(),
      isActive: true,
      isSigned: true,
      reason: "",
    },
  });

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
      if (!fee.studentUid) {
        Swal.fire("Error", "Por favor seleccione un estudiante", "error");
        return;
      }

      const student = getUserById(fee.studentUid);
      if (!student) {
        Swal.fire("Error", "No se encontró un estudiante con ese UID", "error");
        return;
      }

      if (!selectedFile) {
        Swal.fire("Error", "Por favor seleccione una imagen", "error");
        return;
      }

      setIsUploading(true);

      // Subir la imagen a Firebase Storage
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${timestamp}-${student.cc}`;
      const storage = getStorage();
      const storageRef = ref(storage, `fees/${fileName}`);
      await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Crear el objeto fee
      const feeToSave: fee = {
        ...fee,
        id:uuid(),
        cc: student.cc,
        imageUrl,
      };

      // Guardar el fee en Firebase
      await createFee(feeToSave);

      // Mostrar mensaje de éxito
      Swal.fire("Éxito", "El registro se ha guardado correctamente", "success");
      
      // Limpiar el formulario
      reset();

      setIsUploading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Ocurrió un error al guardar el registro", "error");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
        noValidate={true}
      >
        <div className="mb-4">
          <label>Nro de recibo:</label>
          <input type="text" value={generateInvoiceNumber()} readOnly />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Escoja estudiante
          </label>
          <Controller
            name="studentUid"
            control={control}
            rules={{ required: "Por favor escoja un estudiante" }}
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
                        label: student.name,
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
                  // Extrae solo el value (uid) del estudiante seleccionado
                  onChange(selectedOption ? selectedOption?.value : "");
                }}
              />
            )}
          />
          {errors.studentUid && (
            <p className="text-red-500 text-xs italic">
              {errors.studentUid.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Valor
          </label>
          <Controller
            name="qty"
            rules={{ required: "Por favor ingrese un valor" }}
            control={control}
            render={({ field: { onChange, onBlur, ref, name } }) => (
              <input
                id={name}
                ref={ref}
                onBlur={onBlur}
                type="number"
                step="0.01"
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
          {errors.qty && (
            <p className="text-red-500 text-xs italic">{errors.qty.message}</p>
          )}
        </div>
        {/* Place NameInput */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lugar
          </label>
          <input
            type="text"
            {...register("place", { required: "El lugar es requerido" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.place && (
            <p className="text-red-500 text-xs italic">
              {errors.place.message}
            </p>
          )}
        </div>
        {/* Date Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha
          </label>
          <input
            type="date"
            {...register("createdAt", {
              required: "Necesita seleccionar una fecha",
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.createdAt && (
            <p className="text-red-500 text-xs italic">
              {errors.createdAt.message}
            </p>
          )}
        </div>
        {/* Customer NameInput */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cliente
          </label>
          <input
            type="text"
            {...register("customerName", { required: "Nombre del cliente es requerido" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs italic">
              {errors.customerName.message}
            </p>
          )}
        </div>
         {/* Reason Input */}
         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Motivo
          </label>
          <input
            type="text"
            {...register("reason", { required: "Escribir el motivo del pago" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.reason && (
            <p className="text-red-500 text-xs italic">
              {errors.reason.message}
            </p>
          )}
        </div>
        {/* IMAGE */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seleccionar imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                if (!file.type.startsWith("image/")) {
                  console.error("El archivo debe ser una imagen.");
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  console.error("El archivo no debe exceder los 5 MB.");
                  return;
                }
                setSelectedFile(file);
              }
              // setSelectedFile(e.target.files?.[0] || null);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out"
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? "Guardando..." : "Registrar pago"}
        </button>
      </form>
    </div>
  );
};
