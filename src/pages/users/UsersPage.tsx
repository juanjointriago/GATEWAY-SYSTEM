import { FirestoreUser } from "../../interface";
import {
  useAuthStore,
  useLevelStore,
  useSubLevelStore,
  useUserStore,
} from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import {
  IoBook,
  IoPencil,
  IoPerson,
  IoDocumentAttachOutline,
} from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import { useMemo, useState, useCallback } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUserform } from "../../components/shared/forms/EditUserform";
import Swal from "sweetalert2";
import { EditUserUnits } from "../../components/shared/forms/EditUserUnits";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
// import { EditStudentSheet } from "../../components/shared/forms/EditStudentSheet";
import { ColumnDef } from "@tanstack/react-table";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { StudentProgressSheet } from "../progress-sheet/StudentProgressSheet";
import { StudentContract } from "../contract/StudentContract";
import { exportUsersToExcel } from "../../helpers/excel.helper";

export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [openStudentSheetModal, setOpenStudentSheetModal] = useState(false);
  const [openContractModal, setOpenContractModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string>();
  const [userforUnit, setUserforUnit] = useState<string>();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const users = useUserStore((state) => state.users);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedSubLevel, setSelectedSubLevel] = useState<string | null>(null);
  const levels = useLevelStore((state) => state.levels);
  const subLevels = useSubLevelStore((state) => state.subLevels);

  // const getAllUsers = useUserStore(state => state.getAllUsers);
  const updateUserById = useUserStore((state) => state.updateUser);
  // const getUserById = useUserStore(state => state.getUserById);

  // Componente del menú dropdown
  const ActionMenu = useCallback(
    ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const isOpen = openDropdown === userId;

      const toggleDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdown(isOpen ? null : userId);
      };

      const handleAction = (action: () => void) => {
        action();
        setOpenDropdown(null);
      };

      return (
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center justify-center w-8 h-8 text-white bg-blue-600 border border-blue-700 rounded-full hover:bg-blue-700 hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="flex flex-col items-center justify-center text-white font-bold text-lg leading-none">
              <span className="block w-1 h-1 bg-white rounded-full mb-0.5"></span>
              <span className="block w-1 h-1 bg-white rounded-full mb-0.5"></span>
              <span className="block w-1 h-1 bg-white rounded-full"></span>
            </span>
          </button>

          {isOpen && (
            <>
              {/* Overlay para cerrar el dropdown */}
              <div
                className="fixed inset-0"
                style={{ zIndex: 999998 }}
                onClick={() => setOpenDropdown(null)}
              />

              {/* Dropdown menu - responsivo */}
              <div 
                className="fixed right-10 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200"
                style={{ zIndex: 999999 }}
              >
                <div className="p-1 sm:p-2">
                  {/* Toggle Active/Inactive */}
                  <button
                    onClick={() =>
                      handleAction(() => {
                        Swal.fire({
                          title: "¿Estás seguro?",
                          text: `Estas a punto de ${
                            isActive ? "desactivar" : "activar"
                          } este usuario`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Sí, continuar",
                          cancelButtonText: "Cancelar",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            const userToUpdate = users.find(
                              (u) => u.id === userId
                            );
                            if (userToUpdate) {
                              await updateUserById({
                                ...userToUpdate,
                                isActive: !isActive,
                              });
                              window.location.reload();
                            }
                          }
                        });
                      })
                    }
                    className={`group flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
                        : "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-center w-6 sm:w-8 h-4 sm:h-5">
                      <ToggleButton isActive={isActive} action={() => {}} />
                    </div>
                    <span className="ml-2 sm:ml-3">
                      {isActive ? "Desactivar usuario" : "Activar usuario"}
                    </span>
                  </button>

                  {/* Separador */}
                  <div className="h-px bg-blue-200 my-1 sm:my-2"></div>
                  {/* Contrato */}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleAction(() => {
                          setOpenContractModal(true);
                          setUserforUnit(userId);
                        })
                      }
                      className="group flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-cyan-700 bg-white hover:bg-purple-50 rounded-lg transition-all duration-200 border border-purple-200 hover:border-cyan-300 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-center w-6 sm:w-8 h-4 sm:h-5 bg-purple-100 rounded-md group-hover:bg-cyan-200 transition-colors duration-200">
                        <IoDocumentAttachOutline className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-600" />
                      </div>
                      <span className="ml-2 sm:ml-3">Contrato</span>
                    </button>
                  )}
                  {/* Editar usuario */}
                  <button
                    onClick={() =>
                      handleAction(() => {
                        setOpenModal(true);
                        setUserToEdit(userId);
                      })
                    }
                    className="group flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm mb-1 sm:mb-2"
                  >
                    <div className="flex items-center justify-center w-6 sm:w-8 h-4 sm:h-5 bg-blue-100 rounded-md group-hover:bg-blue-200 transition-colors duration-200">
                      <IoPencil className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" />
                    </div>
                    <span className="ml-2 sm:ml-3">Editar usuario</span>
                  </button>

                  {/* Asignar libros */}
                  <button
                    onClick={() =>
                      handleAction(() => {
                        setOpenUnitModal(true);
                        setUserforUnit(userId);
                      })
                    }
                    className="group flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-green-700 bg-white hover:bg-green-50 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300 hover:shadow-sm mb-1 sm:mb-2"
                  >
                    <div className="flex items-center justify-center w-6 sm:w-8 h-4 sm:h-5 bg-green-100 rounded-md group-hover:bg-green-200 transition-colors duration-200">
                      <IoBook className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
                    </div>
                    <span className="ml-2 sm:ml-3">Asignar libros</span>
                  </button>

                  {/* Ver Progress Sheet */}
                  <button
                    onClick={() =>
                      handleAction(() => {
                        setOpenStudentSheetModal(true);
                        setUserforUnit(userId);
                      })
                    }
                    className="group flex items-center w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 rounded-lg transition-all duration-200 border border-purple-200 hover:border-purple-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-center w-6 sm:w-8 h-4 sm:h-5 bg-purple-100 rounded-md group-hover:bg-purple-200 transition-colors duration-200">
                      <IoPerson className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" />
                    </div>
                    <span className="ml-2 sm:ml-3">Ver Progress Sheet</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    },
    [
      openDropdown,
      users,
      updateUserById,
      setOpenModal,
      setUserToEdit,
      setOpenUnitModal,
      setUserforUnit,
      setOpenStudentSheetModal,
      setOpenContractModal,
      isAdmin,
    ]
  );
  const columns = useMemo<ColumnDef<FirestoreUser>[]>(
    () => [
      {
        accessorKey: "cc",
        cell: (info) => info.getValue(),
        header: () => <span>Cédula</span>,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Nombres</span>,
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
      },
      {
        accessorFn: (row) => row.level,
        id: "level",
        cell: (info) => <LevelById levelId={info.getValue() as string} />,
        header: () => (
          <div>
            <span>Modalidad</span>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedLevel || ""}
              onChange={(e) => setSelectedLevel(e.target.value || null)}
            >
              <option value="">Todos</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          return filterValue ? row.getValue(columnId) === filterValue : true;
        },
      },
      {
        accessorFn: (row) => row.subLevel,
        id: "subLevel",
        cell: (info) => <SubLevelById subLevelId={info.getValue() as string} />,
        header: () => (
          <div>
            <span>Curso</span>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedSubLevel || ""}
              onChange={(e) => setSelectedSubLevel(e.target.value || null)}
            >
              <option value="">Todos</option>
              {subLevels.map((subLevel) => (
                <option key={subLevel.id} value={subLevel.id}>
                  {subLevel.name}
                </option>
              ))}
            </select>
          </div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          return filterValue ? row.getValue(columnId) === filterValue : true;
        },
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => (
          <div>
            {(info.getValue() as string) &&
              new Date(info.getValue() as string).toDateString()}
          </div>
        ),
        header: () => <span>Registro</span>,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.isActive,
        id: "isActive",
        cell: (info) => (
          <div className="flex items-center justify-center relative">
            {isAdmin ? (
              <div className="relative">
                <ActionMenu
                  userId={info.row.original.id!}
                  isActive={info.getValue() as boolean}
                />
              </div>
            ) : (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                info.getValue() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {info.getValue() ? "Activo" : "Inactivo"}
              </span>
            )}
          </div>
        ),
        header: () => <span>{`${isAdmin ? "Acciones" : "Estado"}`}</span>,
        enableColumnFilter: false,
        enableSorting: false,
        size: isAdmin ? 150 : 100,
      },
    ],
    [levels, subLevels, selectedLevel, selectedSubLevel, isAdmin, ActionMenu]
  );

  // Filtrar usuarios dinámicamente según los filtros seleccionados
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesLevel = selectedLevel ? user.level === selectedLevel : true;
      const matchesSubLevel = selectedSubLevel
        ? user.subLevel === selectedSubLevel
        : true;
      return matchesLevel && matchesSubLevel;
    });
  }, [users, selectedLevel, selectedSubLevel]);

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportUsersToExcel(filteredUsers);
      
      if (success) {
        Swal.fire({
          title: "¡Éxito!",
          text: "El archivo Excel ha sido descargado exitosamente",
          icon: "success",
          confirmButtonText: "Continuar"
        });
      } else {
        Swal.fire("Error", "No se pudo exportar el archivo Excel", "error");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire("Error", "Ocurrió un error al exportar el archivo", "error");
    }
  }, [filteredUsers]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
          Usuarios
        </h1>
        {isAdmin && userToEdit && (
          <ModalGeneric
            title="Actualizar datos"
            isVisible={openModal}
            setIsVisible={setOpenModal}
            children={<EditUserform userId={userToEdit} />}
          />
        )}
        {isAdmin && userforUnit && (
          <ModalGeneric
            title="Administrar Libros"
            isVisible={openUnitModal}
            setIsVisible={setOpenUnitModal}
            children={<EditUserUnits userId={userforUnit} />}
          />
        )}
        {isAdmin && userforUnit && (
          <ModalGeneric
            title="Progress Sheet"
            isVisible={openStudentSheetModal}
            setIsVisible={setOpenStudentSheetModal}
            children={<StudentProgressSheet studentID={userforUnit} />}
          />
        )}
        
        {isAdmin && userforUnit && (
          <ModalGeneric
            title="Contrato del Estudiante"
            isVisible={openContractModal}
            setIsVisible={setOpenContractModal}
            children={<StudentContract studentID={userforUnit} />}
          />
        )}
        
        {/* Botón para exportar usuarios */}
        {isAdmin && (
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
        
        {/* Modal */}
        {<TableGeneric columns={columns} data={filteredUsers} />}
      </div>
    </>
  );
};
