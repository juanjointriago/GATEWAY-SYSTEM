import { FC } from "react"
import { event, status, students } from "../../interface"
import { IconType } from "react-icons";
import { TootipBase } from "../../components/shared/buttons/TootipBase";
import { useEventStore } from "../../stores/events/event.store";
import Swal from "sweetalert2";

interface Props {
    event: event
    students: students;
    Icon: IconType;
    userId: string
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
            return  '👁️‍🗨️ Talvez'
        case 'CONFIRMED':
            return '✅ Aceptado'
        default:
            return 'Tal vez'
    }

}
export const StudentActions: FC<Props> = ({ event, students, Icon, userId }) => {
    const updateEvent = useEventStore(state => state.updateEvent);
    const today = new Date().getTime();
    return (
        <div className="flex flex-row">
            {

                // keys.map((key: string) => (

                    <div key={userId} className="flex flex-row">
                        <TootipBase title="" tootTipText={changeVisualAction(`${students[userId].status}`)}>
                            <div onClick={() => {
                                const student = event.students[userId];
                                if (!event.limitDate) {
                                    Swal.fire('¡Lo sentimos!', 'No se ha asignado una fecha límite para esta clase', 'warning')
                                    return
                                }
                                if (today > event.limitDate) {
                                    Swal.fire('¡Lo sentimos!', 'Estás fuera de la fecha limite', 'error')
                                    return
                                }
                                Swal.fire({
                                    title: '¿Estás seguro?',
                                    text: `Estás a punto de ${student.status === 'CONFIRMED' ? 'CANCELAR' : 'ACEPTAR'} la clase`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sí, estoy seguro',
                                    cancelButtonText: 'No, cancelar',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        updateEvent({ ...event, students: { ...event.students, [userId]: { status: student.status === 'CONFIRMED' ? 'DECLINED' : 'CONFIRMED' } } })
                                        Swal.fire('¡Hecho!', `La clase ha sido ${student.status === 'CONFIRMED' ? 'CANCELADA' : 'ACEPTADA'}`, 'success')
                                    }
                                })
                            }} style={{ backgroundColor: changeVisualColor(`${event.students[userId].status}`) }} className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full">
                                <Icon size={20} color='white' />
                            </div>

                        </TootipBase>
                        <p className="self-center">{changeVisualStatus(event.students[userId].status)}</p>
                    </div>

                // ))
            }
        </div>
    )
}
