import { useEffect, useState } from "react";
import { unit } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useUnitStore } from "../../stores";
import { FormUnit } from "../../components/shared/forms/FormUnit";
import { UrlIframe } from "../../components/shared/pdf/UrlIframe";
import { NavLink } from "react-router-dom";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoPencil, IoTrash } from "react-icons/io5";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUnitForm } from "../../components/shared/forms/EditUnitForm";
import { TableContainerBooks } from "../../components/shared/tables/TableContainerBooks";
import Swal from "sweetalert2";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";



export const UnitsPage = () => {
  const updateUnit = useUnitStore(state => state.updateUnit);
  const deleteUnit = useUnitStore(state => state.deleteUnit);
  const user = useAuthStore(state => state.user);
  // console.log('👀 ==== > USER ', { user })
  const isAdmin = user && user.role === 'admin';
  const getAllUnits = useUnitStore(state => state.getAndSetUnits);
  const books = useUnitStore(state => state.units);
  const [openModal, setOpenModal] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState<unit>()


  useEffect(() => {
    getAllUnits();
  }, [getAllUnits]);
  // console.log('UNIDADES', units);
  const unitsCols: Array<ColumnProps<unit>> = [
    { key: 'orderNumber', title: 'Nro', render: (_, record) => <>{record.orderNumber}</> },
    { key: 'sublevel', title: 'Unidad', render: (_, record) => <SubLevelById subLevelId={record.sublevel} /> },
    { key: 'name', title: 'Nombre' },
    { key: 'supportMaterial', title: 'Mat. de Apoyo', render: (_, record) => <UrlIframe title={record.name} src={record.supportMaterial!} errorMsg="Error al cargar el archivo" /> },
    {
      key: 'workSheetUrl', title: 'Work Sheet', render: (_, record) =>
        <div className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          <NavLink to={record.workSheetUrl} target="_blank" end rel="noreferrer noopener" > <span className="text-sm uppercase text-white-500 hidden md:block">🔍 WorkSheet</span></NavLink> </div>
    },
    {
      key: 'isActive', title: 'Acciones', render: (_, record) => (<>
        {isAdmin ? <div>
          {isAdmin ? <ToggleButton isActive={record.isActive} action={() => {

            console.log(record)
            Swal.fire({
              title: '¿Estás seguro?',
              text: `Estas a punto de ${record.isActive ? 'ocultar' : 'mostrar'} este Libro`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('data for update', { ...record, isActive: record.isActive ? false : true })
                // return
                updateUnit({ ...record, isActive: record.isActive? false : true })
                Swal.fire('¡Hecho!', `El libro ha sido ${record.isActive ? 'desactivado' : 'activado'}`, 'success')
              }
            })
          }} /> : <div>{record.isActive ? 'Disponible' : 'No disponible'}</div>}
          {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenModal(true); setUnitToEdit(record) }} Icon={IoPencil} />}
          {isAdmin && <FabButton isActive
            Icon={IoTrash}
            action={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: `Estas a punto de eliminar este Libro `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteUnit(record.id!);
                }
              })
            }} />}
        </div> : <p>--------</p>}
      </>
      )
    },
  ]

  // const sortedUnits = units.sort((a, b) => a.orderNumber > b.orderNumber ? 1 : -1).filter(unit => unit.isActive);

  const activeUnits = books
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Libros</h1>
        {/**Table comp */}
        {isAdmin && unitToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditUnitForm unit={unitToEdit} />} />}
        <TableContainerBooks
          hasAddBtn={isAdmin}
          columns={unitsCols}
          data={user && ((user.role === 'admin') ? books : user.unitsForBooks ? activeUnits.filter((unit) => user.unitsForBooks.includes(unit.sublevel)) : [])}
          modalChildren={<FormUnit />}
          modalTitle="Crear Unidades" />
      </div>
    </>
  )
}
