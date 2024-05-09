import { IoBarChart, IoCalendar, IoPerson, IoPieChart } from "react-icons/io5"
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



      </div>
    </>
  )
}
