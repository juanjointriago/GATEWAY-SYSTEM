import { FC, useState } from "react"
import { status, students } from "../../interface"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton";
import { useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { getInitials } from "./helper";
import { colors } from "../../theme/theme";




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
    const allStudents = getUserByRole("student");
    const showStudents = studentIds.map((studentId) => allStudents.find((student) => student.id === studentId));
    const [isVisible, setIsVisible] = useState(false);



    return (
        <div
            className="flex flex-row">
            {
                (!studentIds.length ?
                    <p>Sin estudiantes</p>
                    : studentIds.length < 4)
                    ? showStudents && showStudents.map((student) => (
                        <AvatarButton key={student?.id}
                            tootTipText={`${student?.name ?? 'NO name'} - ${changeVisualStatus(record[`${student?.id ?? 'MAYBE'}`]?.status ?? 'MAYBE')}`}
                            initialLetter={getInitials(student?.name ?? 'XX')}
                            isActive
                            color={colors[Math.floor(Math.random() * colors.length)]}
                        />
                    ))
                    : <>
                        {showStudents && showStudents.slice(0, 3).map((student) => (
                            <AvatarButton key={student?.id}
                                tootTipText={`${student?.name ?? 'NO name'} - ${changeVisualStatus(record[`${student?.id ?? 'MAYBE'}`]?.status ?? 'MAYBE')}`}
                                initialLetter={getInitials(student?.name ?? 'XX')}
                                color={colors[Math.floor(Math.random() * colors.length)]}
                                isActive />
                        ))}
                        <AvatarButton
                            initialLetter={`+${studentIds.length - 3}`}
                            isActive
                            tootTipText="Ver todos..."
                            action={() => setIsVisible(true)}
                            color={colors[Math.floor(Math.random() * colors.length)]}
                        />
                    </>
            }
            <ModalGeneric key={`${showStudents.length}`} title="Estudiantes para esta clase" isVisible={isVisible} setIsVisible={setIsVisible} children={<>
                {showStudents && showStudents.map((student) => (
                    <div key={student?.id} className="flex flex-row items-center">
                        <AvatarButton
                            tootTipText={`${student?.name ?? 'NO name'} - ${changeVisualStatus(record[`${student?.id ?? 'MAYBE'}`]?.status ?? 'MAYBE')}`}
                            initialLetter={getInitials(student?.name ?? 'XX').toUpperCase()}
                            color={colors[Math.floor(Math.random() * colors.length)]}
                            isActive />
                        <p>{student?.name} {changeVisualStatus(record[`${student?.id ?? 'MAYBE'}`]?.status ?? 'MAYBE')}</p>
                    </div>
                ))}
            </>} />
        </div>
    )
}
