import { event } from "../../interface";
// import { ColumnProps } from "../../interface/ui/tables.interface";
import { useEventStore } from "../../stores/events/event.store";
import { StudentsList } from "../users/StudentsList";
import {
  useAuthStore,
  useLevelStore,
  useSubLevelStore,
  useUserStore,
} from "../../stores";
import { StudentActions } from "./StudentActions";
import {
  IoCalendarClearOutline,
  IoMail,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import { MdPerson, MdFileDownload } from "react-icons/md";
import { NavLink } from "react-router-dom";
// import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { useMemo, useState, useCallback } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import CustomModal from "../../components/CustomModal";
// import { getInitials } from "../users/helper";
// import { FormEventControl } from "../../components/shared/forms/FormEventControl";
import { EditEventControl } from "../../components/shared/forms/EditEventControl";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { footerMail, sendCustomEmail } from "../../store/firebase/helper";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { IconType } from "react-icons";
import { FormEventControl } from "../../components/shared/forms";
import { exportEventsToExcel } from "../../helpers/excel.helper";

export const EventsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const events = useEventStore((state) => state.events);
  const users = useUserStore((state) => state.users);
  const user = useAuthStore((state) => state.user);
  const sublevels = useSubLevelStore((state) => state.subLevels);
  const levels = useLevelStore((state) => state.levels);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const isAdmin = user && user.role === "admin";
  const isTeacher = user && user.role === "teacher";
  const [openModal, setOpenModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<string>();

  // Estados para CustomModal
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    "success" | "error" | "warn" | "info" | null
  >(null);
  const [confirmAction, setConfirmAction] = useState<
    null | (() => Promise<void> | void)
  >(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warn" | "info" | "danger" | "success";
  }>({ isOpen: false, title: "", message: "", type: "warn" });

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportEventsToExcel(events);
      if (success) {
        setModalType("success");
        setModalMessage("El archivo Excel ha sido descargado exitosamente");
      } else {
        setModalType("error");
        setModalMessage("No se pudo exportar el archivo Excel");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setModalType("error");
      setModalMessage("Ocurrió un error al exportar el archivo");
    }
  }, [events]);

  const iconEdit: IconType = isAdmin ? IoPencil : MdPerson;

  const columns = useMemo<ColumnDef<event>[]>(() => {
    const teacherFilter: FilterFn<event> = (row, columnId, filterValue) => {
      const teacherId = row.getValue<string>(columnId);
      const teacher = users.find((user) => user.id === teacherId);
      return (
        teacher?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        false
      );
    };
    return [
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => {
          const dateValue = info.getValue() as string;
          if (!dateValue) return "Sin fecha";
          const date = new Date(dateValue);
          const formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric", // Año completo
          });
          const formattedTime = date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${formattedDate} ${formattedTime}`;
        },
        header: () => <span>Fecha</span>,
        filterFn: "includesString", // Filtrado por texto
        enableColumnFilter: true,
      },
      {
        accessorKey: "name",
        cell: (info) => (
          <p className="text-start text-nowrap text-xs">
            {info.getValue() as string}
          </p>
        ),
        header: () => <span>Name</span>,
      },
      {
        accessorKey: "limitDate",
        cell: (info) => {
          const dateValue = info.getValue() as string;
          if (!dateValue) return "Sin fecha";
          const date = new Date(dateValue);
          const formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric", // Año completo
          });
          const formattedTime = date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${formattedDate} ${formattedTime}`;
        },
        filterFn: "includesString",
        header: () => <span className="text-xs">F. Limite Resevarcion</span>,
      },
      {
        accessorKey: "teacher",
        cell: (info) => {
          const teacher = users.find(
            (user) => user.id === (info.getValue() as string)
          );
          return teacher ? (
            <span>{teacher.name}</span>
          ) : (
            <span>Sin docente</span>
          );
        },
        header: () => <span>Docente</span>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterFn: teacherFilter,
        enableColumnFilter: true,
      },
      {
        accessorKey: "meetLink",
        id: "meetLink",
        cell: (info) => {
          // console.debug('meetLink =>',info.row.original);
          return (
            <>
              {info.getValue() ? (
                <NavLink
                  to={info.getValue() as string}
                  target="_blank"
                  end
                  rel="noreferrer noopener"
                >
                  <span className="text-sm text-blue-500 md:block">
                    🧑‍💻 Ir a reunión
                  </span>
                </NavLink>
              ) : (
                <span className="text-sm  text-blue-500 md:block">
                  Sin enlace configurado
                </span>
              )}
            </>
          );
        },
        header: () => <span>MeetLink</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "students",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: (record) => {
          return (
            <>
              {isAdmin || isTeacher ? (
                <>
                  {" "}
                  {!record.row.original.students.length ? (
                    <StudentsList
                      key={record.row.original.id}
                      record={record.row.original.students}
                    />
                  ) : (
                    <div>Sin asistentes</div>
                  )}{" "}
                </>
              ) : (
                <>
                  {" "}
                  {user && user.role === "student" ? (
                    <StudentActions
                      userId={user.id!}
                      students={record.row.original.students}
                      event={record.row.original}
                      Icon={IoCalendarClearOutline}
                    />
                  ) : null}{" "}
                </>
              )}
            </>
          );
        },
        header: () => (
          <span className={`${isAdmin ? "text-xs" : undefined}`}>
            {isAdmin ? "Asistentes" : "Confirmar asistencia"}
          </span>
        ),
        enableColumnFilter: false,
      },
      {
        accessorKey: "isActive",
        header: () => <span>Acciones</span>,
        cell: (info) => {
          return (
            <div className="flex flex-direction-row">
              {/* //Cambiar estado */}
              {isAdmin ? (
                <ToggleButton
                  isActive={info.getValue() as boolean}
                  action={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: "¿Estás seguro?",
                      message: `Estás a punto de ${
                        info.getValue() ? "ocultar" : "mostrar"
                      } esta reservación`,
                      type: "warn",
                    });
                    setConfirmAction(() => async () => {
                      await updateEvent({
                        ...info.row.original,
                        isActive: !(info.getValue() as boolean),
                      });
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                      window.location.reload();
                    });
                  }}
                />
              ) : (
                <div>
                  {(info.getValue() as boolean) ? "Público" : "Privado"}
                </div>
              )}
              {/* //Editar reservación */}
              {isAdmin && (
                <FabButton
                  isActive
                  tootTipText={""}
                  action={() => {
                    setOpenModal(true);
                    setEventToEdit(info.row.original.id);
                  }}
                  Icon={iconEdit}
                />
              )}
              {/* //Eliminar reservación */}
              {isAdmin && (
                <FabButton
                  isActive
                  Icon={IoTrash}
                  action={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: "¿Estás seguro?",
                      message: "Estás a punto de eliminar esta reservación",
                      type: "danger",
                    });
                    setConfirmAction(() => async () => {
                      await deleteEvent(info.row.original.id!);
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                      window.location.reload();
                    });
                  }}
                />
              )}
              {/* //envio correo Admin */}
              {isAdmin && (
                <FabButton
                  isActive
                  tootTipText={""}
                  action={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: "¿Estás seguro?",
                      message:
                        "Estás a punto de enviar un correo al docente de esta reservación",
                      type: "info",
                    });
                    setConfirmAction(() => async () => {
                      const text = `Le recordamos que tiene asignado un horario de clase con fecha y hora : ${new Date(
                        info.row.original.date
                      ).toLocaleTimeString([], {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })} con el nombre de ${
                        info.row.original.name
                      }, con estudiantes de la(s) unidad(es) ${info.row.original.levels[0].subLevels
                        .map(
                          (sublevel) =>
                            sublevels.find((sub) => sub.id === sublevel)?.name
                        )
                        .join(", ")}, en modalida de ${
                        levels.find(
                          (level) =>
                            level.id === info.row.original.levels[0].level
                        )?.name
                      }.`;
                      await sendCustomEmail({
                        to: [
                          users.find(
                            (user) => user.id === info.row.original.teacher
                          )!.email!,
                        ],
                        message: {
                          subject: "Recordatorio de reservación",
                          text: `Hola, ${
                            users.find(
                              (user) => user.id === info.row.original.teacher
                            )?.name
                          } ${text}`,
                          html: `<h1>Hola, ${
                            users.find(
                              (user) => user.id === info.row.original.teacher
                            )?.name
                          }</h1> <p>${text}</p> ${footerMail}`,
                        },
                      });
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                      setModalType("success");
                      setModalMessage(
                        `Se ha enviado un correo a ${
                          users.find(
                            (user) => user.id === info.row.original.teacher
                          )?.name
                        }`
                      );
                    });
                  }}
                  Icon={IoMail}
                />
              )}
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ];
  }, [
    isAdmin,
    levels,
    sublevels,
    users,
    updateEvent,
    deleteEvent,
    setEventToEdit,
    isTeacher,
    user,
    iconEdit,
  ]);

  const sortedEvents = events
    .filter((event) => event.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  // console.debug('events', events.length)
  if (user && user.role === "student") {
    console.debug(user);
    console.debug(
      "PREVIOUS",
      sortedEvents.filter(
        (event) =>
          event.students[user.id!] &&
          event.isActive &&
          event.levels[0].level === user.level
      ).length
    );

    console.debug(
      "My Student Events",
      events.filter(
        (event) =>
          event.students[user.id!] &&
          event.levels[0].level == user.level &&
          event.levels[0].subLevels.includes(user.subLevel!)
      ).length
    );
  }
  return (
    <>
      {/* CustomModal de confirmación para acciones */}
      <CustomModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={async () => {
          if (confirmAction) await confirmAction();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
      />
      {/* Modal de mensaje custom */}
      {modalMessage && (
        <ModalGeneric
          title={modalType === "success" ? "¡Éxito!" : "Error"}
          isVisible={!!modalMessage}
          setIsVisible={() => setModalMessage(null)}
        >
          <div
            className={`text-center text-lg ${
              modalType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {modalMessage}
          </div>
        </ModalGeneric>
      )}
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Reservaciones
        </h1>

        {/* Modal para editar evento */}
        {eventToEdit && (
          <ModalGeneric
            title={isAdmin ? "Actualizar datos" : "Progress Sheet"}
            isVisible={openModal}
            setIsVisible={setOpenModal}
            children={
              isAdmin ? (
                <EditEventControl eventId={eventToEdit} />
              ) : (
                <>Formulario para Progress sheet {eventToEdit}</>
              )
            }
          />
        )}

        {/* Modal para agregar nueva reservación */}
        {isAdmin && (
          <ModalGeneric
            title="Crear Reservación"
            isVisible={showModal}
            setIsVisible={setShowModal}
            children={<FormEventControl />}
          />
        )}

        {/* Botón para agregar nueva reservación */}
        {isAdmin && (
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                <MdFileDownload className="w-5 h-5" />
                Exportar Excel
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              + Agregar Reservación
            </button>
          </div>
        )}

        {/* Solo botón de exportación para teachers */}
        {isTeacher && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleExportToExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              <MdFileDownload className="w-5 h-5" />
              Exportar Excel
            </button>
          </div>
        )}

        {/* Tabla con TableGeneric */}
        {events && (
          <TableGeneric
            columns={columns}
            data={
              (user &&
                (user.role === "admin"
                  ? sortedEvents
                  : user.role === "teacher"
                  ? sortedEvents.filter((event) => event.teacher === user.id)
                  : sortedEvents.filter(
                      (event) =>
                        event.students[user.id!] &&
                        event.isActive 
                        &&
                        event.levels[0].level === user.level
                    ))) ??
              []
            }
          />
        )}
      </div>
    </>
  );
};
