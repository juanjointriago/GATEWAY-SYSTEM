import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"


const levelsCols:Array<ColumnProps<level>> = [
  { key: 'Código', title: 'Código' },
  { key: 'Nombre', title: 'Nombre' },
  { key: 'Descripción', title: 'Descripción' },
  { key: 'Es', title: 'Es Público' },
  { key: 'Acciones', title: 'Acciones', render: (_, record) => {
    return <div className="text-blue-500 font-bold">{record.name}</div>;
  }},
]


export const LevelsPage = () => {
  return (
    <>
    <div>LevelsPage</div>
    <TableContainer columns={levelsCols} />
    </>
  )
}
