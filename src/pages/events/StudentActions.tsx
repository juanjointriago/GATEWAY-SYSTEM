import { FC, useState } from "react";
import { event, status, students } from "../../interface";
import { IconType } from "react-icons";
import { TootipBase } from "../../components/shared/buttons/TootipBase";
import { useEventStore } from "../../stores/events/event.store";
import CustomModal from "../../components/CustomModal";

interface Props {
    event: event;
    students: students;
    Icon: IconType;
    userId: string;
}

const changeVisualAction = (status: status) => {
    switch (status) {
        case 'CONFIRMED':
            return '❌ CANCELAR CLASE'
        case 'DECLINED':
            return '✅ ACEPTAR CLASE'
        default:
            return '❌ CANCELAR CLASE'
    }

}

const changeVisualColor = (status: status) => {
    switch (status) {
        case 'CONFIRMED':
            return 'blue'
        case 'DECLINED':
            return 'gray'
        default:
            return 'gray'
    }

}
const changeVisualStatus = (status: status) => {
    switch (status) {
        case 'DECLINED':
            return '❌ Cancelado '
        case 'MAYBE':
            return '👁️‍🗨️ Talvez'
        case 'CONFIRMED':
            return '✅ Aceptado'
        default:
            return 'Tal vez'
    }

}
export const StudentActions: FC<Props> = ({ event, students, Icon, userId }) => {
    const updateEvent = useEventStore(state => state.updateEvent);
    const today = Date.now();

    // Estado para CustomModal
    const [customModalOpen, setCustomModalOpen] = useState(false);
    const [customModalTitle, setCustomModalTitle] = useState("");
    const [customModalMessage, setCustomModalMessage] = useState("");
    const [customModalType, setCustomModalType] = useState<"warn" | "info" | "danger" | "success">("info");
    const [customModalAction, setCustomModalAction] = useState<() => void>(() => {});

    const showModal = (
        title: string,
        message: string,
        type: "warn" | "info" | "danger" | "success",
        action?: () => void
    ) => {
        setCustomModalTitle(title);
        setCustomModalMessage(message);
        setCustomModalType(type);
        setCustomModalAction(() => {
            return () => {
                setCustomModalOpen(false);
                if (action) action();
            };
        });
        setCustomModalOpen(true);
    };
    return (
        <>
            <div className="flex flex-row">
            {
                // keys.map((key: string) => (
                <div key={userId} className="flex flex-row">
                    <TootipBase title="" tootTipText={changeVisualAction(`${students[userId].status}`)}>
                        <div onClick={() => {
                            const student = event.students[userId];
                            const aceptedStudents = Object.values(event.students).filter((student) => student.status === 'CONFIRMED').length;
                            if (!event.limitDate) {
                                showModal(
                                    "We're sorry! - ¡Lo sentimos!",
                                    "No booking deadline has been assigned for this class. - No se ha asignado una fecha límite de reservación para esta clase",
                                    "warn"
                                );
                                return;
                            }
                            if (today > new Date(event.limitDate).getTime()) {
                                showModal(
                                    "We're sorry! - ¡Lo sentimos!",
                                    "You are out of the reservation deadline - Estás fuera de la fecha limite de reservación",
                                    "danger"
                                );
                                return;
                            }
                            if (event.maxAssistantsNumber <=aceptedStudents) {
                                // console.debug('Nro de estudiantes => ', Object.keys(event.students).length, 'Maximo nro de estudiantes evento =>',event.maxAssistantsNumber);
                                showModal(
                                    "We're sorry! - ¡Lo sentimos!",
                                    "This class is already full - Esta clase ya se encuentra llena - ",
                                    "danger"
                                );
                                return;
                            }
                            showModal(
                                "¿Estás seguro?",
                                `Estás a punto de ${
                                    student.status === "CONFIRMED" ? "CANCELAR" : "ACEPTAR"
                                } la clase`,
                                "warn",
                                async () => {
                                    await updateEvent({
                                        ...event,
                                        students: {
                                            ...event.students,
                                            [userId]: {
                                                status:
                                                    student.status === "CONFIRMED" ? "DECLINED" : "CONFIRMED",
                                            },
                                        },
                                    });
                                    showModal(
                                        "¡Hecho!",
                                        `La clase ha sido ${
                                            student.status === "CONFIRMED" ? "CANCELADA" : "ACEPTADA"
                                        }`,
                                        "success",
                                        () => {
                                            window.location.reload();
                                        }
                                    );
                                }
                            );
                        }} style={{ backgroundColor: changeVisualColor(`${event.students[userId].status}`) }} className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full">
                            <Icon size={20} color='white' />
                        </div>

                    </TootipBase>
                    <p className="self-center">{changeVisualStatus(event.students[userId].status)}</p>
                </div>

                // ))
            }
            </div>

            <CustomModal
                isOpen={customModalOpen}
                title={customModalTitle}
                message={customModalMessage}
                type={customModalType}
                onConfirm={customModalAction}
                onCancel={() => setCustomModalOpen(false)}
            />
        </>
    )
}
