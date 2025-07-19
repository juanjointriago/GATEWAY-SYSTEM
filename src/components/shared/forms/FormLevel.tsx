import { useForm } from "react-hook-form";
import { level } from "../../../interface";
import { useLevelStore } from "../../../stores";
import { v4 as uuid } from 'uuid'
import CustomModal from "../../../components/CustomModal";
import { useState } from "react";

export const FormLevel = () => {

    const createLevel = useLevelStore(state => state.createLevel);
    const defaultValues: level = {
        name: '',
        description: '',
        isActive: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm<level>({ defaultValues });
    // Estados para CustomModal
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");

    const showFeedback = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', reload = false) => {
        setFeedbackTitle(title);
        setFeedbackMessage(message);
        setFeedbackType(type);
        setFeedbackOpen(true);
        if (reload) setTimeout(() => window.location.reload(), 1200);
    };

    const onSubmit = handleSubmit(async (data) => {
        const levelRecord = { id: uuid(), ...data };
        try {
            await createLevel(levelRecord);
            showFeedback('Modalidad creada', 'Modalidad creada con éxito', 'success', true);
            reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showFeedback('Error', error.message || 'Ocurrió un error al crear la modalidad.', 'danger');
            console.error({ error });
        }
    });
    return (
        <>
            <CustomModal
                isOpen={feedbackOpen}
                title={feedbackTitle}
                message={feedbackMessage}
                type={feedbackType}
                onConfirm={() => setFeedbackOpen(false)}
            />
            <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-4 border border-gray-200">
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                            Nombre *
                        </label>
                        <input
                            {...register("name", { required: "El nombre es obligatorio 👀", })}
                            id="name"
                            type="text"
                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            placeholder="Ej. Vespertino" />
                        {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                            Descripción *
                        </label>
                        <input
                            {...register("description", { required: "La descripción es obligatoria 👀" })}
                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            id="description"
                            type="text"
                            placeholder="Ej. Se da solo en las tardes" />
                        {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="mt-2">
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
                        {errors.isActive && <p className="text-red-500 text-xs italic mt-1">{errors.isActive.message}</p>}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150"
                            type="submit"
                        >
                            <span className="mr-2">💾</span> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
