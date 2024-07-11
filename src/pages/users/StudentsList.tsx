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
    const keys = Object.keys(record);
    return (
        <div className="flex flex-row">{
            keys.map((key) =>  (<div key={key}>
                    <AvatarButton  tootTipText={`${users.find(user=>user.id === key)!.name} ${changeVisualStatus(record[key].status)}`} initialLetter={`${users.find(user=>user.id === key)!.name.split(" ")[0][0].toUpperCase()}${users.find(user=>user.id === key)!.name.split(" ")[1][0].toUpperCase()}`} isActive/>
                    </div>)
            )
        }</div>
    )
}
