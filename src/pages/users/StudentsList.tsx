import { FC, useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin = user && user.role === "admin";
    const isTeacher = user && user.role === 'teacher';
  const navigate = useNavigate(); // Hook para redirigir

  // Filtrar estudiantes basado en la búsqueda
  const filteredStudents = showStudents.filter((student) =>
    student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modalId = useMemo(() => uuid(), []); // Crear un ID estable para el modal

  return (
    <div className="w-full">
      {(!studentIds.length ? (
        <p className="text-gray-500 italic">Sin estudiantes</p>
      ) : studentIds.length < 4) ? (
        <div className="flex flex-wrap gap-2 p-2">
          {showStudents &&
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
            ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 p-2">
          {showStudents &&
            showStudents.slice(0, 0).map((student) => (
              <AvatarButton
                key={uuid()}
                tootTipText={`${student?.name ?? "NO name"} - ${changeVisualStatus(
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
        key={modalId} // Usar el ID estable
        title="Estudiantes para esta clase"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        children={
          <div className="space-y-4 p-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 
                  border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  focus:border-transparent"
                autoFocus // Añadido para mejor UX
              />
            </div>

            {/* Lista de estudiantes filtrada */}
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No se encontraron estudiantes
              </p>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={uuid()}
                  className="flex items-center justify-between gap-3 p-3 
                    rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AvatarButton
                      initialLetter={getInitials(student?.name ?? "XX").toUpperCase()}
                      color={colors[Math.floor(Math.random() * colors.length)]}
                      isActive
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <p
                        className={`${
                          student?.isActive ? "text-gray-700" : "text-red-500"
                        } font-medium`}
                      >
                        {student?.name}
                      </p>
                      <p className="text-indigo-600 text-sm">
                        {changeVisualStatus(
                          record[`${student?.id ?? "MAYBE"}`]?.status ?? "MAYBE"
                        )}
                      </p>
                    </div>
                  </div>

                  {(isAdmin || isTeacher) && (
                    <FabButton
                      isActive
                      tootTipText="Ver Progress Sheet"
                      action={() => navigate(`/dashboard/progress-sheet/${student?.uid}`)}
                      Icon={IoSchool}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        }
      />
    </div>
  );
};
