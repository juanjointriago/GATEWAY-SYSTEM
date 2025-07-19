import { FC, useEffect, useState } from "react";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";
import { useUserStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { NoGradesMessage } from "./NoGradesMessage";
import { ProgressEntry, StudentInfo } from "../../interface/progresssheet.interface";

interface Props {
  studentID: string;
}

export const StudentProgressSheet: FC<Props> = ({ studentID }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getUserById = useUserStore((state) => state.getUserById);
  const getProgressSheetByStudentId = useProgressSheetStore(
    (state) => state.getProgressSheetByStudentId
  );
  const student = getUserById(studentID);
  const getEventById = useEventStore((state) => state.getEventById);
  if (!student) {
    return <NoGradesMessage />;
  }
  const progressSheet = getProgressSheetByStudentId(studentID);
  if (!progressSheet) {

    return <NoGradesMessage message="A este estudiante no se le ha asignado un progressSheet debes actualizar su contrato" />;
  }
  if (progressSheet.progressClasses.length === 0) {
    return <NoGradesMessage />;
  }
  const age =
    new Date().getFullYear() - new Date(student.bornDate).getFullYear();
  const progressEntries: ProgressEntry[] = progressSheet.progressClasses.map(
    (record) => {
      const event = getEventById(record.eventInfo.value);
      if (!event) return {} as ProgressEntry;
      const teacher = getUserById(event.teacher || "");
      return {
        ...record,
        teacher: teacher?.name || "Sin docente",
        date: new Date(record.createdAt || 0).toLocaleDateString(),
        hour: new Date(record.createdAt || 0).toLocaleTimeString(),
      };
    }
  );
  const studentInfo: StudentInfo = {
    ...student,
    headline: "",
    preferredName: progressSheet.myPreferredName || student.name,
    age: age.toString(),
    birthday: student.bornDate,
    occupation: progressSheet.work || "N/D",
    fullName: student.name,
    gender: "undefined",
    observation: progressSheet.observation || "N/D",
    otherContacts: progressSheet.otherContacts || student.phone,
    phone: student.phone,
    idNumber: student.cc,
    regNumber: progressSheet.contractNumber || 'N/D',
    inscriptionDate: progressSheet.inscriptionDate || "",
    expirationDate: progressSheet.expirationDate || "",
    progressEntries: progressEntries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    }),
  };

  if (!isMounted) {
    return null;
  }

  // Vista responsiva y atractiva para el estudiante
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg mt-4 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 text-center">
        Progress Sheet
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">
              Nombre de Representante:
            </span>{" "}
            {studentInfo.preferredName}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">ID Nº:</span>{" "}
            {studentInfo.idNumber}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">REG Nº:</span>{" "}
            {studentInfo.regNumber}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Inscripción:</span>{" "}
            {new Date(studentInfo.inscriptionDate).toLocaleDateString()}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Expiración:</span>{" "}
            {new Date(studentInfo.expirationDate).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Nombre completo:</span>{" "}
            {studentInfo.fullName}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Edad:</span>{" "}
            {studentInfo.age}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Cumpleaños:</span>{" "}
            {new Date(studentInfo.birthday).toLocaleDateString()}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Teléfono:</span>{" "}
            {studentInfo.phone}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Otros contactos:</span>{" "}
            {studentInfo.otherContacts}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Observación:</span>{" "}
        {studentInfo.observation}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Fecha
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Hora
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Libro
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Progreso
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Parte
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Test
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Docente
              </th>
              <th className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-700">
                Observación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {studentInfo.progressEntries.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.date}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.hour}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.book}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.progress}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.part}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.test}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {entry.teacher}
                </td>
                <td className="px-2 py-2 text-xs md:text-sm text-gray-700">
                  {entry.observation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
