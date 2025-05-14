import { FirestoreUser } from "../../interface";
import { useAuthStore, useLevelStore, useSubLevelStore, useUserStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoBook, IoPencil, IoPerson } from "react-icons/io5";
import { useMemo, useState } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUserform } from "../../components/shared/forms/EditUserform";
import Swal from "sweetalert2";
import { EditUserUnits } from "../../components/shared/forms/EditUserUnits";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
// import { EditStudentSheet } from "../../components/shared/forms/EditStudentSheet";
import { ColumnDef } from "@tanstack/react-table";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { StudentProgressSheet } from "../progress-sheet/StudentProgressSheet";



export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [openStudentSheetModal, setOpenStudentSheetModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string>();
  const [userforUnit, setUserforUnit] = useState<string>();
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
        cell: (info) => <div>{info.getValue() as string && new Date(info.getValue() as string).toDateString()}</div>,
        header: () => <span>Registro</span>,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.isActive,
        id: "isActive",
        cell: (info) => (
          <div className="flex flex-row">
          {isAdmin ? <ToggleButton isActive={info.getValue() as boolean} action={() => {
                    Swal.fire({
                      title: '¿Estás seguro?',
                      text: `Estas a punto de ${info.getValue() ? 'desactivar' : 'activar'}}`,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sí, continuar',
                      cancelButtonText: 'Cancelar'
                    }).then(async(result) => {
                      if (result.isConfirmed) {
                        await updateUserById({ ...info.row.original, isActive: !info.getValue() });
                        window.location.reload();
                      }
                    })
                  }} /> : <div>{info.getValue() ? 'Disponible' : 'No disponible'}</div>}
                  {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenModal(true); setUserToEdit(info.row.original.id) }} Icon={IoPencil} />}
                  {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenUnitModal(true); setUserforUnit(info.row.original.id) }} Icon={IoBook} />}
                  {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenStudentSheetModal(true); setUserforUnit(info.row.original.id) }} Icon={IoPerson} />}
          </div>
         
        ),
        header: () => <span>{`${isAdmin ? 'Acciones' : 'Estado'}`}</span>,
        enableColumnFilter: false,
      },
    ],
    [levels, subLevels, selectedLevel, selectedSubLevel]
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
        {/* Modal */}
        { <TableGeneric columns={columns} data={filteredUsers} /> }
      </div>
    </>
  );
};
