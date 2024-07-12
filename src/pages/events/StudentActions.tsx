import { FC } from "react"
import { status, students } from "../../interface"
import { IconType } from "react-icons";
import { TootipBase } from "../../components/shared/buttons/TootipBase";

interface Props {
    students: students;
    Icon: IconType;
    action: () => void;
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
            return 'green'
        case 'DECLINED':
            return 'yellow'
        default:
            return 'gray'
    }

}
export const StudentActions: FC<Props> = ({ students, Icon,action }) => {
    const keys = Object.keys(students);
    return (
        <div className="flex flex-row">
            {
                keys.map((key:string) => (
                    <TootipBase action={action}  key={key} title="" tootTipText={changeVisualAction(`${students[key].status}`)}>
                        <div style={{backgroundColor:changeVisualColor(`${students[key].status}`)}} className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full">
                            <Icon size={20} color='white' />
                        </div>
                    </TootipBase>

                ))
            }
        </div>
    )
}
