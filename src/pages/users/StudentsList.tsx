import { FC, useState } from "react"
import {  status,  students } from "../../interface"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton";
import { useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";




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
    const getUserByRole = useUserStore(state => state.getUserByRole);
    const studentIds = Object.keys(record);
    const studentStatus = Object.values(record);
    console.log({studentStatus});
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
                (!studentIds.length ?
                    <p>Sin estudiantes</p>
                    :
                    studentIds.length < 4)
                    ? showStudents && showStudents.map((student) => (
                        <AvatarButton key={student?.id}
                            tootTipText={student?.name ?? 'NO name'}
                            initialLetter={getInitials(student?.name ?? 'XX')}
                            isActive />
                    ))
                    : <>
                        {showStudents && showStudents.slice(0, 3).map((student) => (
                            <AvatarButton key={student?.id}
                                tootTipText={student?.name ?? 'NO name'}
                                initialLetter={getInitials(student?.name ?? 'XX')}
                                isActive />
                        ))}
                        <AvatarButton
                            initialLetter={`+${studentIds.length - 3}`}
                            isActive
                            tootTipText="Ver todos..."
                            action={() => setIsVisible(true)} />
                    </>
            }
            <ModalGeneric title="Estudiantes para esta clase" isVisible={isVisible} setIsVisible={setIsVisible} children={<>
                {showStudents && showStudents.map((student) => (
                    <div key={student?.id} className="flex flex-row items-center">
                        <AvatarButton
                            tootTipText={student?.name ?? 'NO name'}
                            initialLetter={getInitials(student?.name ?? 'XX')}
                            isActive />
                        <p>{student?.name} {changeVisualStatus(record[`${student!.id!}`].status)}</p>
                    </div>
                ))}
                </>}/>
            </div>
    )
}
