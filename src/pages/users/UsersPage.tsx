import { FirestoreUser } from "../../interface";
import { useAuthStore, useUserStore } from "../../stores";
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
import { EditStudentSheet } from "../../components/shared/forms/EditStudentSheet";
import { ColumnDef } from "@tanstack/react-table";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";



export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [openStudentSheetModal, setOpenStudentSheetModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string>();
  const [userforUnit, setUserforUnit] = useState<string>();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const users = useUserStore((state) => state.users);
  
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
        header: () => <span>Modalidad</span>,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.subLevel,
        id: "subLevel",
        cell: (info) => <SubLevelById subLevelId={info.getValue() as string} />,
        header: () => <span>Curso</span>,
        enableColumnFilter: false,
        filterFn: (row, columnId, filterValue) => {
          return row.getValue(columnId) === filterValue;
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
    []
  );

  const sortedUsers = users.sort( (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            children={<EditStudentSheet userId={userforUnit} />}
          />
        )}
        {/* Modal */}
        {isAdmin ? (  <TableGeneric columns={columns} data={sortedUsers} />)
        : ( <TableGeneric columns={columns} data={sortedUsers} />)}
      </div>
    </>
  );
};
