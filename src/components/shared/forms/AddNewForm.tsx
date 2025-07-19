import { useRef, useState } from "react";
import { useNewsStore } from "../../../stores/news/news.store";
import { useForm } from "react-hook-form";
import { INew } from "../../../interface/new.interface";
import CustomModal from "../../../components/CustomModal";
import { v6 as uuid } from "uuid";
import Select, { SingleValue } from "react-select"; // Importar react-select

export const AddNewForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
  const [modalAction, setModalAction] = useState<() => void>(() => () => setModalOpen(false));

  // Diseño responsivo y atractivo
  const showModal = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', action?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalAction(() => action ? action : () => setModalOpen(false));
    setModalOpen(true);
  };
  const fileRef = useRef<HTMLInputElement>(null);
  const createNew = useNewsStore((state) => state.createNews);
  const [fileUpload, setFileUpload] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultValues: INew = {
    title: "",
    description: "",
    imageUrl: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<INew>({ defaultValues });

  const visibilityOptions = [
    { value: true, label: "Visible" },
    { value: false, label: "No Visible" },
  ];
  const handleSelectChange = (
    option: SingleValue<{ value: boolean; label: string }>
  ) => {
    if (option) {
      setValue("isActive", option.value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileUpload(files);

    // Crear preview de la imagen
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = handleSubmit(async (data: INew) => {
    const newRecord = { id: uuid(), altText: data.title, ...data };
    if (fileUpload && fileUpload.length > 1) {
      showModal("Ups!", "Solo puedes subir un archivo", "warn");
      return;
    }
    if (!fileUpload) {
      showModal("Error", "Debe subir un archivo", "danger");
      return;
    }
    const inputFile = fileRef.current as HTMLInputElement | null;
    showModal("Creando Noticia", "Espera un poco...", "info", () => {});
    await createNew(newRecord, fileUpload[0]);
    setModalOpen(false);
    showModal("Noticia almacenada", "Noticia creado con éxito", "success");
    if (inputFile) inputFile.value = "";
    setFileUpload(null);
    setPreviewUrl(null);
    reset();
  });

  return (
    <>
      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={modalAction}
        onCancel={() => setModalOpen(false)}
      />
      <div className="flex justify-center items-center bg-gradient-to-br to-emerald-50 py-2 px-2 sm:px-4">
        <form 
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
          onSubmit={onSubmit}
        >
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center tracking-tight">Crear Noticia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="col-span-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="title"
              >
                Nombre *
              </label>
              <input
                {...register("title", {
                  required: "El titulo es obligatorio 👀",
                })}
                id="title"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                placeholder="Nuevos descuentos con Dinners Club"
              />
              {errors.title && (
                <p className="text-red-500 text-xs italic">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="description"
              >
                Descripción *
              </label>
              <input
                {...register("description", {
                  required: "La descripción es obligatoria 👀",
                })}
                id="description"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                placeholder="Cada vez que pagas con tu tarjeta de Dinners Club, acumulas puntos que puedes canjear por descuentos en tus próximas compras."
              />
              {errors.description && (
                <p className="text-red-500 text-xs italic">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="imageUrl">
                Imagen de Noticia *
              </label>
              <input
                className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                ref={fileRef}
                id="imageUrl"
                type="file"
                placeholder="Subir archivo"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-xs italic mt-1">{errors.imageUrl.message}</p>
              )}
              {/* Vista previa de la imagen */}
              <div className="mt-3 flex justify-center">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <div className="w-32 h-32 overflow-hidden rounded-lg border shadow-md">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        if (fileRef.current) fileRef.current.value = "";
                        setFileUpload(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No hay imagen cargada</span>
                )}
              </div>
            </div>
            <div className="col-span-1">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="isActive"
              >
                Visible? *
              </label>
              <Select
                options={visibilityOptions}
                placeholder="Selecciona visisbilidad"
                onChange={handleSelectChange}
                classNamePrefix="select"
                id="isActive"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
              {errors.isActive && (
                <p className="text-red-500 text-xs italic">
                  {errors.isActive.message}
                </p>
              )}
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end mt-8">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-base px-8 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-150"
                type="submit"
              >
                <span className="inline-block align-middle mr-2">💾</span> Crear Noticia
              </button>
            </div>
          </div>
        </form>
      </div>
    </>

  );
}
