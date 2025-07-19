import { FC, useEffect, useState } from "react"
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores"
import { CardWithImage } from "../cards/CardWithImage";
import { FirestoreUser } from "../../../interface";
import CustomModal from "../../../components/CustomModal";

interface Props {
    userId: string;
}
export const EditUserUnits: FC<Props> = ({ userId }) => {
    console.debug(userId)
    const units = useSubLevelStore(store => store.subLevels);
    const getUserById = useUserStore(store => store.getUserById);
    const user = getUserById(userId)!;
    const updateUser = useUserStore(store => store.updateUser);
    const getUnit = useSubLevelStore(store => store.getSubLevelById);
    const getModality = useLevelStore(store => store.getLevelById);
    const [unitsForBooks, setUnitsForBooks] = useState<string[]>(user.unitsForBooks ? user.unitsForBooks : []);
    const updatedUser: FirestoreUser = { ...user, unitsForBooks };

    useEffect(() => {
        return () => setUnitsForBooks(user.unitsForBooks ? user.unitsForBooks : []);
    }, [userId, user.unitsForBooks])

    // Estados para CustomModal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});
    const [modalCancelable, setModalCancelable] = useState<boolean>(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");

    const showModal = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', action?: () => Promise<void> | void, cancelable = false) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setModalAction(() => action || (() => setModalOpen(false)));
        setModalCancelable(cancelable);
        setModalOpen(true);
    };

    const showFeedback = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success') => {
        setFeedbackTitle(title);
        setFeedbackMessage(message);
        setFeedbackType(type);
        setFeedbackOpen(true);
    };

    const handleSave = () => {
        showModal(
            'Actualizando material de apoyo',
            `Las unidades del usuario ${user.name} se van a modificar. ¿Desea continuar?`,
            'warn',
            async () => {
                setModalOpen(false);
                try {
                    await updateUser(updatedUser);
                    showFeedback('Actualización exitosa', `Actualización de unidades de ${user.name} realizada exitosamente.`, 'success');
                    setTimeout(() => window.location.reload(), 1200);
                } catch (error) {
                    showFeedback('Error', 'Ocurrió un error al actualizar las unidades. Inténtalo de nuevo.', 'danger');
                }
            },
            true
        );
    };
    // console.debug('units',units.filter(unit => unit.isActive));
    // console.debug('=====> unidades del usuario', { unitsForBooks: user.unitsForBooks });
    return (
        <>
            <CustomModal
                isOpen={modalOpen}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onConfirm={modalAction}
                onCancel={modalCancelable ? () => setModalOpen(false) : undefined}
            />
            <CustomModal
                isOpen={feedbackOpen}
                title={feedbackTitle}
                message={feedbackMessage}
                type={feedbackType}
                onConfirm={() => setFeedbackOpen(false)}
            />
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-4 border border-gray-200">
                <CardWithImage
                    title={user.role === 'student' ? `Estudiante - ${getModality(user.level!)?.name}` : 'Docente/Administrativo'}
                    p1={user.name}
                    p2={user.role === 'student' ? 'Unidad asignada: ' + (getUnit(user.subLevel ?? '')?.name ?? 'N/A') : 'Unidad asignada: N/A'}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 mt-4">
                    {unitsForBooks && units.filter(unit => unit.isActive).sort((a, b) => a.name > b.name ? 1 : -1).map((unit) => (
                        <label className="flex items-center bg-indigo-50 rounded-lg px-3 py-2 shadow-sm border border-indigo-100 hover:bg-indigo-100 transition cursor-pointer" key={unit.id} htmlFor={unit.id}>
                            <input
                                className="accent-indigo-500 h-5 w-5"
                                checked={unitsForBooks.includes(unit.id!)}
                                type="checkbox"
                                id={unit.id}
                                name={unit.name}
                                value={unit.id}
                                onChange={() => {
                                    if (unitsForBooks.includes(unit.id!)) {
                                        setUnitsForBooks((prev) => prev.filter((id) => id !== unit.id))
                                    } else {
                                        setUnitsForBooks((prev) => [...prev, unit.id!])
                                    }
                                }}
                            />
                            <span className="ml-3 text-indigo-800 font-medium truncate">{unit.name}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150"
                        type="button"
                        onClick={handleSave}
                    >
                        <span className="mr-2">💾</span> Guardar cambios
                    </button>
                </div>
            </div>
        </>
    )
}
