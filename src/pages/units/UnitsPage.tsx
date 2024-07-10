import { useEffect, useState } from "react";
import { unit } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useUnitStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FormUnit } from "../../components/shared/forms/FormUnit";
import { UrlIframe } from "../../components/shared/pdf/UrlIframe";
import { NavLink } from "react-router-dom";




export const UnitsPage = () => {
  const unitsCols: Array<ColumnProps<unit>> = [
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'level', title: 'Curso', render: (_, record) => <LevelById levelId={record.sublevel} /> },
    {
      key: 'supportMaterial', title: 'Mat. de Apoyo', render: (_, record) => <>
        <UrlIframe 
        title={record.name}
        src={record.supportMaterial!} errorMsg="Error al cargar el archivo" />
      </>
    },
    {
      key: 'workSheetUrl', title: 'Work Sheet', render: (_, record) => 
      <div className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        <NavLink to={record.workSheetUrl} target="_blank" end>
          <span className="text-sm uppercase text-blue-500 hidden md:block">🔍 WorkSheet</span>
        </NavLink> </div>
    },
    // { key: 'isActive', title: 'Activo', render: (_, record) => record.isActive ? <input type="checkbox" defaultChecked={true} /> : <input type="checkbox" defaultChecked={false} /> },
    // {
    //   key: 'Acciones', title: 'Acciones', render: (_, record) => {
    //     return <div className="flex flex-row justify-between">
    //       <div className="text-blue-500 font-bold" onClick={() => console.log("Editar", { record })}>✚ </div>
    //       <div className="text-blue-500 font-bold" onClick={() => console.log('Activar registro por id', record.id)}>✅ </div>
    //       <div className="text-blue-500 font-bold" onClick={() => console.log('Eliminar por id', record.id)}>🗑️ </div>
    //     </div>;
    //   }
    // },
  ]
  const getAllUnits = useUnitStore(state => state.getAndSetUnits);
  const units = useUnitStore(state => state.units);
  const [filteredData, setFilteredDat6a] = useState<unit[]>(units)
  const [searchTerms, setSearchTerms] = useState('')
  useEffect(() => {
    getAllUnits();
  }, []);


  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Unidades</h1>
        {/* searchInput */}
        <div className="ml-5 p-4 w-1/4 flex justify-end">
          <input type="text" id="table-search"
            placeholder="🔍      Buscar ...   " onChange={(e) => {
              setSearchTerms(e.target.value)
              if (searchTerms.length > 0) {
                const results = units.filter(unit =>
                  unit["name"].toLowerCase().includes(searchTerms.toLowerCase())
                )
                setFilteredDat6a(results)
              }
            }}
          />
        </div>
        {/**Table comp */}
        <TableContainer columns={unitsCols} data={filteredData} modalChildren={<FormUnit />} modalTitle="Crear Unidades" />
      </div>
    </>
  )
}
