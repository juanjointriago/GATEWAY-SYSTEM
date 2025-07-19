import { useForm } from "react-hook-form";
import { unit } from "../../../interface";
import { useSubLevelStore, useUnitStore } from "../../../stores";
import { v6 as uuid } from 'uuid'
import { useRef, useState, useEffect } from "react";
import CustomModal from "../../CustomModal";

export const FormUnit = () => {
  const fileRef = useRef(null);
  const createUnit = useUnitStore(state => state.createUnit);
  const unitQTY = useUnitStore(state => state.units.length);
  const subLevels = useSubLevelStore(state => state.subLevels);

  const [fileUpload, setFileUpload] = useState<FileList | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Previsualización del PDF
  useEffect(() => {
    if (fileUpload && fileUpload[0]) {
      const url = URL.createObjectURL(fileUpload[0]);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [fileUpload]);
  const defaultValues: unit = {
    name: '',
    description: '',
    sublevel: '',
    photoUrl: '',
    // supportMaterial: '',
    workSheetUrl: '',
    isActive: false,
    orderNumber: unitQTY + 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm<unit>({ defaultValues });
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'warn' | 'info' | 'danger' | 'success',
    onConfirm: () => {},
    onCancel: undefined as (() => void) | undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  console.debug({ isLoading });

  const onSubmit = handleSubmit(async (data: unit) => {
    const unitRecord = { id: uuid(), ...data };
    if (!fileUpload) {
      setModal({
        isOpen: true,
        title: 'Ups!',
        message: 'Debe subir un archivo',
        type: 'warn',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
        onCancel: undefined,
      });
      return;
    }
    setIsLoading(true);
    setModal({
      isOpen: true,
      title: 'Creando Material',
      message: 'Espera un poco...',
      type: 'info',
      onConfirm: () => {},
      onCancel: undefined,
    });
    const inputFile = fileRef.current as HTMLInputElement | null;
    await createUnit(unitRecord, fileUpload[0]);
    setIsLoading(false);
    setModal({
      isOpen: true,
      title: 'Material almacenado',
      message: 'Material de apoyo creado con éxito',
      type: 'success',
      onConfirm: () => {
        setModal(m => ({ ...m, isOpen: false }));
        inputFile!.value = '';
        fileRef.current = null;
        reset();
      },
      onCancel: undefined,
    });
    console.debug({ data });
  });

  return (
    <>
      <CustomModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-6 px-2 sm:px-4">
        <form 
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
          onSubmit={onSubmit}
        >
          <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center tracking-tight">Crear Unidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="col-span-1">
            <label htmlFor="sublevel" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Unidad a la que pertenece</label>
            <select
              {...register("sublevel", { required: "La unidad es obligatorio 👀" })}
              id="sublevel"
              defaultValue={''}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
              <option value={''}>Seleccione la Unidad</option>
              {
                subLevels.filter(unit=>unit.isActive).map((sublevel) => {
                  return <option key={sublevel.id} value={sublevel.id}>{sublevel.name}</option>
                })
              }
            </select>
            {errors.sublevel && <p className="text-red-500 text-xs italic">{errors.sublevel.message}</p>}
          </div>
            <div className="col-span-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
              Nombre *
            </label>
            <input
              {...register("name", { required: "El nombre es obligatorio 👀", })}
              id="name"
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Ej. Unidad 1" />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>

            <div className="col-span-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
              Descripción *
            </label>
            <input
              {...register("description", { required: "La descripción es obligatoria 👀" })}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              type="text"
              placeholder="Ej. Se da solo en las tardes" />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>
            <div className="col-span-1">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="supportMaterial">
                Material de apoyo *
              </label>
              <input
                className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                ref={fileRef}
                id="image"
                type="file"
                placeholder="Subir archivo"
                accept=".pdf"
                onChange={(e) => setFileUpload(e.target.files)}
                required
              />
              {/* Miniatura del PDF */}
              <div className="mt-3 flex justify-center">
                {previewUrl ? (
                  <embed src={previewUrl} type="application/pdf" width="90%" height="160px" className="border rounded-lg shadow-md" />
                ) : (
                  <span className="text-xs text-gray-400">No hay material de apoyo cargado</span>
                )}
              </div>
              {errors.supportMaterial && <p className="text-red-500 text-xs italic mt-1">{errors.supportMaterial.message}</p>}
            </div>
            <div className="col-span-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="workSheetUrl">
              Link de LiveWorkSheet *
            </label>
            <input
              {...register("workSheetUrl")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="workSheetUrl"
              type="text"
              placeholder="Aqui suba el enlace de material de apoyo" />
            {errors.workSheetUrl && <p className="text-red-500 text-xs italic">{errors.workSheetUrl.message}</p>}
          </div>


            <div className="col-span-1 md:col-span-2 flex items-center mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                {...register("isActive", { required: "Este campo debe registrarse por primera vez como Activo 👀" })}
                id="isActive"
                type="checkbox"
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
            </label>
            {errors.isActive && <p className="text-red-500 text-xs italic">{errors.isActive.message}</p>}
          </div>
        </div>
          <div className="flex justify-end mt-8">
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-base px-8 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-150"
              type="submit"
            >
              <span className="inline-block align-middle mr-2">💾</span> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
