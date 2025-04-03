import { FC, useState } from "react";
import { status, students } from "../../interface";
import { AvatarButton } from "../../components/shared/buttons/AvatarButton";
import { useAuthStore, useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { getInitials } from "./helper";
import { colors } from "../../theme/theme";
import { v6 as uuid } from "uuid";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoSchool } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  record: students;
}

const changeVisualStatus = (status: status) => {
  switch (status) {
    case "DECLINED":
      return "❌ Cancelado ";
    case "MAYBE":
      return "⁇ Talvez";
    case "CONFIRMED":
      return "✅ Aceptado";
    case "COMMING":
      return "👁️‍🗨️ Reservación creada";
    default:
      return "Talvez";
  }
};
export const StudentsList: FC<Props> = ({ record }) => {
  const getUserByRole = useUserStore((state) => state.getUserByRole);
  const studentIds = Object.keys(record);
  const allStudents = getUserByRole("student");
  const showStudents = studentIds.map((studentId) =>
    allStudents.find((student) => student.id === studentId)
  );
  const [isVisible, setIsVisible] = useState(false);
  const user = useAuthStore((state) => state.user);

  const isAdmin = user && user.role === "admin";
  //   const isTeacher = user && user.role === 'teacher';
  const navigate = useNavigate(); // Hook para redirigir

  return (
    <div key={uuid()} className="flex flex-row">
      {(!studentIds.length ? <p>Sin estudiantes</p> : studentIds.length < 4) ? (
        showStudents &&
        showStudents.map((student) => (
          <AvatarButton
            key={student?.id}
            tootTipText={`${student?.name ?? "NO name"} - ${changeVisualStatus(
              record[`${student?.id ?? "MAYBE"}`]?.status ?? "MAYBE"
            )}`}
            initialLetter={getInitials(student?.name ?? "XX")}
            isActive
            color={colors[Math.floor(Math.random() * colors.length)]}
          />
        ))
      ) : (
        <div key={uuid()} className="flex flex-row items-center ">
          {showStudents &&
            showStudents
              .slice(0, 3)
              .map((student) => (
                <AvatarButton
                  key={uuid()}
                  tootTipText={`${
                    student?.name ?? "NO name"
                  } - ${changeVisualStatus(
                    record[`${student?.id ?? "MAYBE"}`]?.status ?? "MAYBE"
                  )}`}
                  initialLetter={getInitials(student?.name ?? "XX")}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                  isActive
                />
              ))}
          <AvatarButton
            initialLetter={`+${studentIds.length - 3}`}
            isActive
            tootTipText="Ver todos..."
            action={() => setIsVisible(true)}
            color={colors[Math.floor(Math.random() * colors.length)]}
          />
        </div>
      )}
      <ModalGeneric
        key={uuid()}
        title="Estudiantes para esta clase"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        children={
          <div key={uuid()}>
            {showStudents &&
              showStudents.map((student) => (
                <div key={uuid()} className="flex flex-row items-center h-1/2">
                  <AvatarButton
                    initialLetter={getInitials(
                      student?.name ?? "XX"
                    ).toUpperCase()}
                    color={colors[Math.floor(Math.random() * colors.length)]}
                    isActive
                  />
                  <p
                    className={`${
                      student?.isActive ? "text-gray-500" : "text-red-500"
                    } `}
                  >
                    {student?.name} -{" "}
                  </p>
                  <p className="text-indigo-700">
                    -{" "}
                    {changeVisualStatus(
                      record[`${student?.id ?? "MAYBE"}`]?.status ?? "MAYBE"
                    )}
                  </p>
                  {isAdmin && (
                    <FabButton
                      isActive
                      tootTipText={""}
                      action={() => {
                        navigate(`/dashboard/progress-sheet/${student?.uid}`); // Redirigir al progress-sheet con el uid del estudiante
                      }}
                      Icon={IoSchool}
                    />
                  )}
                </div>
              ))}
          </div>
        }
      />
    </div>
  );
};
