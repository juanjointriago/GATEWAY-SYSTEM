import { useEffect, useState } from "react";
import { unit } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useUnitStore } from "../../stores";
import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FormUnit } from "../../components/shared/forms/FormUnit";
import { UrlIframe } from "../../components/shared/pdf/UrlIframe";
import { NavLink } from "react-router-dom";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoEye, IoEyeOff, IoPencil } from "react-icons/io5";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUnitForm } from "../../components/shared/forms/EditUnitForm";



export const UnitsPage = () => {
  const updateUnit = useUnitStore(state => state.updateUnit);
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const getAllUnits = useUnitStore(state => state.getAndSetUnits);
  const units = useUnitStore(state => state.units);
  const [openModal, setOpenModal] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState<string>()


  useEffect(() => {
    getAllUnits();
  }, []);
  // console.log('UNIDADES', units);
  const unitsCols: Array<ColumnProps<unit>> = [
    { key: 'sublevel', title: 'Unidad', render: (_, record) => <SubLevelById subLevelId={record.sublevel} /> },
    { key: 'name', title: 'Nombre' },
    { key: 'supportMaterial', title: 'Mat. de Apoyo', render: (_, record) => <UrlIframe title={record.name} src={record.supportMaterial!} errorMsg="Error al cargar el archivo" /> },
    {
      key: 'workSheetUrl', title: 'Work Sheet', render: (_, record) =>
        <div className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          <NavLink to={record.workSheetUrl} target="_blank" end rel="noreferrer noopener" > <span className="text-sm uppercase text-white-500 hidden md:block">🔍 WorkSheet</span></NavLink> </div>
    },
    {
      key: 'isActive', title: 'Publico?', render: (_, record) => (<>
        <FabButton isActive Icon={record.isActive ? IoEye : IoEyeOff} action={isAdmin ? () => updateUnit({ ...record, isActive: !record.isActive }) : () => console.log('')} />
        {isAdmin && <FabButton isActive tootTipText={''} action={() => {
          setOpenModal(true);
          setUnitToEdit(record.id)
        }} Icon={IoPencil} />}
      </>
      )
    },
  ]



  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Libros</h1>
        {/**Table comp */}
        {unitToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditUnitForm unitId={unitToEdit} />} />}

        <TableContainer
          hasAddBtn={isAdmin}
          columns={unitsCols}
          data={user && ((user.role === 'admin') ? units : units.filter((unit) => unit.sublevel === user.subLevel))}
          modalChildren={<FormUnit />}
          modalTitle="Crear Unidades" />
      </div>
    </>
  )
}
