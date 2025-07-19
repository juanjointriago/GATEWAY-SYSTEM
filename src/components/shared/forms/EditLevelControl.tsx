import { FC, useState } from 'react';
// import { v6 as uuid } from 'uuid'
import { level } from '../../../interface';
import { useLevelStore } from '../../../stores';
import { Controller, useForm } from 'react-hook-form';
import CustomModal from '../../../components/CustomModal';

interface Props {
    levelId: string
}
export const EditLevelControl: FC<Props> = ({ levelId }) => {
    const getLevelById = useLevelStore(state => state.getLevelById);
    const editLevel = useLevelStore(state => state.updateLevel);


    //To formulary
    const defaultValues: level = {
        ...getLevelById(levelId)!,
        updatedAt: Date.now()
    };

    const { control, handleSubmit, reset, formState: { errors } } = useForm<level>({ defaultValues })

    // Estados para CustomModal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});

    const onSubmit = handleSubmit(async (data: level) => {
        try {
            await editLevel(data);
            setModalTitle('Modalidad actualizada');
            setModalMessage('Modalidad actualizada con éxito');
            setModalType('success');
            setModalAction(() => () => { setModalOpen(false); window.location.reload(); });
            setModalOpen(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setModalTitle('Error');
            setModalMessage(error.message || 'Ocurrió un error al actualizar la modalidad');
            setModalType('danger');
            setModalAction(() => () => setModalOpen(false));
            setModalOpen(true);
            console.error(error);
        }
        reset(defaultValues);
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
            <form className="w-full max-w-lg" onSubmit={onSubmit}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                            Nombre *
                        </label>
                        <Controller
                            rules={{ required: "El nombre es obligatorio 👀" }}
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <input
                                    id="name"
                                    {...field}
                                    type="text"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                    placeholder="Ej. Vespertino" />
                            )}
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>
                    <div className="w-full md:w-1/1 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                            Descripción *
                        </label>
                        <Controller
                            rules={{ required: "La descripción es obligatoria 👀" }}
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <input
                                    id="description"
                                    {...field}
                                    type="text"
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                    placeholder="Ej. Se da solo en las tardes" />
                            )}
                        />
                        {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}

                    </div>
                    <div className="w-full md:w-1/1 mt-4 px-3">
                        <label className="inline-flex items-center cursor-pointer">
                            <Controller
                                // rules={{ required: "Este campo debe registrarse por primera vez como Activo 👀" }}//justneed those for create or not?
                                control={control}
                                name="isActive"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <input
                                        onBlur={onBlur}
                                        onChange={() => onChange(!value)}
                                        checked={value}
                                        ref={ref}
                                        id="isActive"
                                        type="checkbox"
                                        className="sr-only peer"

                                    />
                                )}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
                        </label>
                        {errors.isActive && <p className="text-red-500 text-xs italic">{errors.isActive.message}</p>}

                        <div className="mt-10 flex flex-end">
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 mr-11"
                                type="submit"
                            >Guardar  💾</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
