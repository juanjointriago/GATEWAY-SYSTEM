/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { generateInvoiceNumber } from "../../../helpers/invoice.helper";
import { fee } from "../../../interface/fees.interface";
import { useUserStore } from "../../../stores";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

export const AddFeeForm = () => {
  //   const { register } = useFormContext();
  const getUserByRole = useUserStore((state) => state.getUserByRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const students = getUserByRole("student").filter((student) => student.isActive)!;

  const today = new Date();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<fee>({
    defaultValues: {
      studentUid: "",
      qty: 0,
      createdAt: today.getDate(),
      updatedAt: today.getDate(),
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
      backgroundColor: state.isSelected ? "#4299e1" : "white",
      color: !state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: state.isSelected ? "#4299e1" : "#ebf8ff",
      },
    }),
  };

  const onSubmit = async (fee: fee) => {
    try {
      console.log("Form fee:", fee);
      // Aquí puedes agregar la lógica para guardar en Firebase
    } catch (error) {
      console.error("Error submitting form:", error);
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
            render={({ field }) => (
              <Select
                {...field}
                options={students}
                isLoading={isLoading}
                styles={customStyles}
                isClearable
                isSearchable
                placeholder="Buscar Estudiante.."
                noOptionsMessage={() => (error ? error : "No students found")}
                onChange={(option) => {
                    field.onChange(option?.id);
                    console.log('✅',option?.id);
                }}
                value={students.find((option) => option.id === field.value)}
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
          <input
            type="number"
            step="0.01"
            {...register("qty", {
              required: "Amount is required",
              min: { value: 0, message: "Amount must be positive" },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.qty && (
            <p className="text-red-500 text-xs italic">{errors.qty.message}</p>
          )}
        </div>
        {/* Date Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            {...register("createdAt", { required: "Date is required" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.createdAt && (
            <p className="text-red-500 text-xs italic">
              {errors.createdAt.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? "Gaurdando..." : "Registrar pago"}
        </button>
      </form>
    </div>
  );
};
