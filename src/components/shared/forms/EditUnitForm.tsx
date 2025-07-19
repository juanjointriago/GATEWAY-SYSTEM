import { FC, useEffect, useRef, useState } from "react"
import { useSubLevelStore, useUnitStore } from "../../../stores";
import { unit } from "../../../interface";
import CustomModal from "../../../components/CustomModal";
import { useForm } from "react-hook-form";

interface Props {
    unit: unit
}
export const EditUnitForm: FC<Props> = ({ unit }) => {
    const fileRef = useRef(null);
    const updateUnit = useUnitStore(state => state.updateUnit);
    const subLevels = useSubLevelStore(state => state.subLevels);
    // const getUnitById = useUnitStore(state => state.getUnitById);
    const [currentUnit, setCurrentUnit] = useState<unit>(unit);
    // const currentUnit = getUnitById(unitId)!;
    // useEffect(() => {
    //     if(!currentUnit)return;
    //     setCurrentUnit(getUnitById(unitId)!);
    // }, [getUnitById, unitId])

    useEffect(() => {
        setCurrentUnit(unit);
    }, [unit]);

    const [fileUpload, setFileUpload] = useState<FileList | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    console.debug('👀====> ', { currentUnit });

    const defaultValues: unit = { ...currentUnit }
    const { register, handleSubmit, reset, formState: { errors } } = useForm<unit>({ defaultValues });
    // Estados para CustomModal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});

    // Limpiar URL de vista previa cuando cambia el archivo
    useEffect(() => {
        if (fileUpload && fileUpload[0]) {
            const url = URL.createObjectURL(fileUpload[0]);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [fileUpload]);

    const onSubmit = handleSubmit(async (data: unit) => {
        const unitRecord = { ...data };
        try {
            if (!fileUpload) {
                const inputFile = fileRef.current as HTMLInputElement | null;
                await updateUnit(unitRecord);
                setModalTitle('Material actualizado');
                setModalMessage('Material de apoyo actualizado con éxito');
                setModalType('success');
                setModalAction(() => () => {
                    if (inputFile) inputFile.value = '';
                    fileRef.current = null;
                    reset();
                    setModalOpen(false);
                });
                setModalOpen(true);
                return;
            }
            if (fileUpload) {
                const inputFile = fileRef.current as HTMLInputElement | null;
                await updateUnit(unitRecord, fileUpload[0]);
                setModalTitle('Material Actualizado');
                setModalMessage('Material de actualizado creado con éxito');
                setModalType('success');
                setModalAction(() => () => {
                    if (inputFile) inputFile.value = '';
                    fileRef.current = null;
                    reset();
                    setModalOpen(false);
                });
                setModalOpen(true);
            }
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Ocurrió un error al actualizar el material';
            setModalTitle('Error');
            setModalMessage(errMsg);
            setModalType('danger');
            setModalAction(() => () => setModalOpen(false));
            setModalOpen(true);
            console.error(error);
        }
    });

     useEffect(() => {
        reset(currentUnit);
    }, [currentUnit, reset]);

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
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-6 px-2 sm:px-4">
                <form 
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
                    onSubmit={onSubmit}
                >
                    <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center tracking-tight">Editar Unidad</h2>
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
                                    subLevels.filter((item) => item.isActive).map((sublevel) => {
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
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="orderNumber">
                                Orden
                            </label>
                            <input
                                {...register("orderNumber", { required: "Seleccione el orden 👀" })}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="orderNumber"
                                type="number"
                            />
                            {errors.orderNumber && <p className="text-red-500 text-xs italic">{errors.orderNumber.message}</p>}
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
                            />
                            {/* Miniatura del PDF */}
                            <div className="mt-3 flex justify-center">
                                {previewUrl ? (
                                    <embed src={previewUrl} type="application/pdf" width="90%" height="160px" className="border rounded-lg shadow-md" />
                                ) : currentUnit.supportMaterial ? (
                                    <embed src={currentUnit.supportMaterial} type="application/pdf" width="90%" height="160px" className="border rounded-lg shadow-md" />
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
