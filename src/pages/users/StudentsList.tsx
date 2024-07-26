import { FC } from "react"
import { status, students } from "../../interface"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton";
import { useUserStore } from "../../stores";

interface Props {
    record: students
}

const changeVisualStatus = (status: status) => {
    switch (status) {
        case 'DECLINED':
            return '❌ Cancelado '
        case 'MAYBE':
            return '⁇ Talvez'
        case 'CONFIRMED':
            return '✅ Aceptado'
        default:
            return 'Talves'
    }

}
export const StudentsList: FC<Props> = ({ record }) => {
    const users = useUserStore(state => state.users);
    const studentIds = Object.keys(record);
    return (
        <div className="flex flex-row">{
            studentIds.length < 4 ? studentIds.map((student) => (<div key={student}>
                <AvatarButton tootTipText={`${users.find(user => user.id === student)!.name} ${changeVisualStatus(record[student].status)}`} initialLetter={`${users.find(user => user.id === student)!.name.split(" ")[0][0].toUpperCase()}${users.find(user => user.id === student)!.name.split(" ")[1][0].toUpperCase()}`} isActive />
            </div>)
            ):<>Select option</>
        }</div>
    )
}
