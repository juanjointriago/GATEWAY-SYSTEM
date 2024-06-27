import { IoBarChart, IoCalendar, IoPerson, IoPersonAdd, IoPersonAddOutline, IoPersonRemove, IoPersonRemoveOutline, IoPieChart } from "react-icons/io5"
import { WhiteCard } from "../../components"

export const DashboardPage = () => {

  return (
    <>
      <h1>Dashboard</h1>
      <p>Información colectiva de todas las entidades de Gateway</p>
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        <WhiteCard centered>
          <IoPerson size={48} className="text-indigo-600" />
          <h2>Usuarios</h2>
          <p>Total de Personas</p>
        </WhiteCard>

        <WhiteCard centered>
          <IoPieChart size={48} className="text-indigo-600" />
          <h2>Niveles</h2>
          <p>Total de Niveles</p>
        </WhiteCard>


        <WhiteCard centered>
          <IoBarChart size={48} className="text-indigo-600" />
          <h2>Sub-Niveles</h2>
          <p>Total de Sub-Niveles</p>
        </WhiteCard>



        <WhiteCard centered>
          <IoCalendar size={48} className="text-indigo-600" />
          <h2>Eventos</h2>
          <p>Total de Eventos</p>
        </WhiteCard>


        <WhiteCard centered>
          <IoPersonAdd size={48} className="text-indigo-600" />
          <h2>Estudiantes</h2>
          <p>Total de estudiantes Activos</p>
        </WhiteCard>



        <WhiteCard centered>
          <IoPersonAddOutline size={48} className="text-indigo-600" />
          <h2>Docentes</h2>
          <p>Total de docentes Activos</p>
        </WhiteCard>


        <WhiteCard centered>
          <IoPersonRemove size={48} className="text-indigo-600" />
          <h2>Estudiantes Inactivos</h2>
          <p>Total de estudiantes en baja</p>
        </WhiteCard>


        <WhiteCard centered>
          <IoPersonRemoveOutline size={48} className="text-indigo-600" />
          <h2>Docentes Inactivos</h2>
          <p>Total de docentes en baja</p>
        </WhiteCard>

      </div>
    </>
  )
}
