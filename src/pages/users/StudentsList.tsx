import { FC, useState } from "react"
import { 
    // status, 
    students } from "../../interface"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton";
import { useUserStore } from "../../stores";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";




interface Props {
    record: students
}

// const changeVisualStatus = (status: status) => {
//     switch (status) {
//         case 'DECLINED':
//             return '❌ Cancelado '
//         case 'MAYBE':
//             return '⁇ Talvez'
//         case 'CONFIRMED':
//             return '✅ Aceptado'
//         default:
//             return 'Talves'
//     }

// }
export const StudentsList: FC<Props> = ({ record }) => {
    const animatedComponents = makeAnimated();
    const getUserByRole = useUserStore(state => state.getUserByRole);
    const studentIds = Object.keys(record);
    const allStudents = getUserByRole("student");
    const showStudents = studentIds.map((studentId) => allStudents.find((student) => student.id === studentId));
    const [isVisible, setIsVisible] = useState(false);
    const getInitials = (name: string) => {
        // `${allStudents.find(user => user.id === student)!.name.split(" ")[0][0].toUpperCase()}${allStudents.find(user => user.id === student)!.name.split(" ")[1][0].toUpperCase()}`
        return (name.split(" ").length > 1)
            ? `${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1][0].toUpperCase()}`
            : name ? name.slice(0, 1) : 'XX'
    }
    return (
        <div
            className="flex flex-row">
            {
                (studentIds.length < 4)
                    ? showStudents && showStudents.map((student) => (
                        <AvatarButton key={student?.id}
                            tootTipText={student?.name ?? 'NO name'}
                            initialLetter={getInitials(student?.name ?? 'XX')}
                            isActive />
                    ))
                    : <>
                        <div>
                            Ver mas...
                        </div>
                    </>
            }
            <ModalGeneric isVisible={isVisible} setIsVisible={setIsVisible} children={<>
                </>}/>
            </div>
    )
}
