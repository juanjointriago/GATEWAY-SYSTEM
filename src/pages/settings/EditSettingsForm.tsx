
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEnterpriseInfoStore } from "../../stores/enterpriseinfo/enterpriseinfo.store";
import { IenterpriseInfo } from "../../interface/enterprise.interface";
import { 
  IoBusiness, 
  IoLocation, 
  IoCall, 
  IoMail, 
  IoGlobe, 
  IoPhonePortrait,
  IoAdd,
  IoTrash,
  IoSave,
  IoImage
} from "react-icons/io5";
import { toast } from "sonner";

// Esquema de validación con Zod
const enterpriseInfoSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  address: z.string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  phoneNumber: z.string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos"),
  mobileNumber: z.string()
    .min(10, "El móvil debe tener al menos 10 dígitos")
    .max(15, "El móvil no puede exceder 15 dígitos"),
  ruc: z.string()
    .min(10, "El RUC debe tener al menos 10 caracteres")
    .max(13, "El RUC no puede exceder 13 caracteres"),
  email: z.string()
    .email("Ingrese un email válido")
    .optional()
    .or(z.literal("")),
  website: z.string()
    .url("Ingrese una URL válida")
    .optional()
    .or(z.literal("")),
  logo: z.string()
    .url("Ingrese una URL válida para el logo")
    .optional()
    .or(z.literal("")),
  socialMedia: z.object({
    facebook: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
    instagram: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
    twitter: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
    linkedin: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
    youtube: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
    tiktok: z.string().url("Ingrese una URL válida").optional().or(z.literal("")),
  }).optional(),
  generalConditions: z.array(z.string()).min(0).optional(),
});

type EnterpriseFormData = z.infer<typeof enterpriseInfoSchema>;

interface EditSettingsFormProps {
  initialData: IenterpriseInfo;
  onSave: (data: IenterpriseInfo) => void;
  onCancel: () => void;
}

export const EditSettingsForm: React.FC<EditSettingsFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const { updateEnterpriseInfo, loading } = useEnterpriseInfoStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseInfoSchema),
    defaultValues: {
      name: initialData.name || "",
      address: initialData.address || "",
      phoneNumber: initialData.phoneNumber || "",
      mobileNumber: initialData.mobileNumber || "",
      ruc: initialData.ruc || "",
      email: initialData.email || "",
      website: initialData.website || "",
      logo: initialData.logo || "",
      socialMedia: {
        facebook: initialData.socialMedia?.facebook || "",
        instagram: initialData.socialMedia?.instagram || "",
        twitter: initialData.socialMedia?.twitter || "",
        linkedin: initialData.socialMedia?.linkedin || "",
        youtube: initialData.socialMedia?.youtube || "",
        tiktok: initialData.socialMedia?.tiktok || "",
      },
      generalConditions: initialData.generalConditions || [],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: "generalConditions",
  });

  const onSubmit = async (data: EnterpriseFormData) => {
    try {
      // Filtrar condiciones vacías
      const filteredConditions = data.generalConditions?.filter(
        (condition: string) => condition.trim() !== ""
      ) || [];

      // Preparar datos para actualización
      const updateData: IenterpriseInfo = {
        ...initialData,
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
        mobileNumber: data.mobileNumber,
        ruc: data.ruc,
        email: data.email || undefined,
        website: data.website || undefined,
        logo: data.logo || undefined,
        socialMedia: {
          facebook: data.socialMedia?.facebook || undefined,
          instagram: data.socialMedia?.instagram || undefined,
          twitter: data.socialMedia?.twitter || undefined,
          linkedin: data.socialMedia?.linkedin || undefined,
          youtube: data.socialMedia?.youtube || undefined,
          tiktok: data.socialMedia?.tiktok || undefined,
        },
        generalConditions: filteredConditions,
        updatedAt: Date.now(),
      };

      await updateEnterpriseInfo(updateData);
      toast.success("Información actualizada exitosamente");
      onSave(updateData);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Hubo un problema al actualizar la información");
    }
  };

  const addCondition = () => {
    append("");
  };

  const removeCondition = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Información Básica */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IoBusiness className="w-5 h-5 text-blue-600" />
          Información Básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa *
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el nombre de la empresa"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUC *
            </label>
            <input
              {...register("ruc")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el RUC"
            />
            {errors.ruc && (
              <p className="text-red-500 text-xs mt-1">{errors.ruc.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoLocation className="inline w-4 h-4 mr-1" />
              Dirección *
            </label>
            <textarea
              {...register("address")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese la dirección completa"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoCall className="inline w-4 h-4 mr-1" />
              Teléfono *
            </label>
            <input
              {...register("phoneNumber")}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el teléfono"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoPhonePortrait className="inline w-4 h-4 mr-1" />
              Móvil *
            </label>
            <input
              {...register("mobileNumber")}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el número móvil"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoMail className="inline w-4 h-4 mr-1" />
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoGlobe className="inline w-4 h-4 mr-1" />
              Sitio Web
            </label>
            <input
              {...register("website")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com"
            />
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <IoImage className="inline w-4 h-4 mr-1" />
              URL del Logo
            </label>
            <input
              {...register("logo")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/logo.png"
            />
            {errors.logo && (
              <p className="text-red-500 text-xs mt-1">{errors.logo.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Redes Sociales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              {...register("socialMedia.facebook")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/empresa"
            />
            {errors.socialMedia?.facebook && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.facebook.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              {...register("socialMedia.instagram")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/empresa"
            />
            {errors.socialMedia?.instagram && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.instagram.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              {...register("socialMedia.twitter")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/empresa"
            />
            {errors.socialMedia?.twitter && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.twitter.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              {...register("socialMedia.linkedin")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/empresa"
            />
            {errors.socialMedia?.linkedin && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.linkedin.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              {...register("socialMedia.youtube")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/empresa"
            />
            {errors.socialMedia?.youtube && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.youtube.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TikTok
            </label>
            <input
              {...register("socialMedia.tiktok")}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://tiktok.com/@empresa"
            />
            {errors.socialMedia?.tiktok && (
              <p className="text-red-500 text-xs mt-1">{errors.socialMedia.tiktok.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Condiciones Generales */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Condiciones Generales
          </h3>
          <button
            type="button"
            onClick={addCondition}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors"
          >
            <IoAdd className="w-4 h-4" />
            Agregar
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1">
                <textarea
                  {...register(`generalConditions.${index}`)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Condición ${index + 1}`}
                />
                {errors.generalConditions?.[index] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.generalConditions[index]?.message}
                  </p>
                )}
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md flex items-center justify-center transition-colors"
                >
                  <IoTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
        >
          <IoSave className="w-5 h-5" />
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
};