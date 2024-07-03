import { TableContainer } from "../../components/shared/tables/TableContainer"
import { event } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"


const eventCols:Array<ColumnProps<event>> = [
  { key: 'Código', title: 'Código' },
  { key: 'Nombre', title: 'Nombre' },
  { key: 'Fecha', title: 'Fecha' },
  { key: 'Hora', title: 'Hora' },
  { key: 'Status', title: 'Status' },
  { key: 'Profesor', title: 'Profesor' },
  { key: 'Estudiantes', title: 'Estudiantes' },
  { key: 'Es', title: 'Es Público' },
  { key: 'Acciones', title: 'Acciones' },
]




export const EventsPage = () => {
  return (
    <div className="flex flex-col">
      <TableContainer columns={eventCols} />
    </div>
  )
}
