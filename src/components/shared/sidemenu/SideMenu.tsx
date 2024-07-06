import { IconType } from "react-icons";
import { IoBarChart, IoBook, IoCalendar, IoLogoTableau, IoLogOutOutline, IoPerson, IoPieChart, IoSpeedometerOutline } from 'react-icons/io5'
import { SideMenuItem } from "./SideMenuItem";
import './SideMenu.css';
import { useAuthStore } from "../../../stores/auth/auth.store";
import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


interface MenuItem {
  title: string;
  subTitle: string;
  href: string;
  Icon: IconType;
  active?:boolean;
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Estadisticas del sitio', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Cursos', subTitle: 'Administrador de Cursos', href: '/dashboard/courses', Icon: IoLogoTableau,active: true },
  { title: 'Unidades', subTitle: 'Unidades de trabajo', href: '/dashboard/units', Icon: IoBook,active: true },
  { title: 'Usuarios', subTitle: 'Listado de usuarios', href: '/dashboard/users', Icon: IoPerson, active: true },
  { title: 'Niveles', subTitle: 'Niveles de clase', href: '/dashboard/levels', Icon: IoPieChart, active: true},
  { title: 'Sub-Niveles', subTitle: 'Subniveles de clase', href: '/dashboard/sub-levels', Icon: IoBarChart, active: true },
  { title: 'Eventos', subTitle: 'Creación de eventos', href: '/dashboard/events', Icon: IoCalendar, active: true },

]


export const SideMenu = () => {
  const user = useAuthStore(state => state.user);
  const authStatus = useAuthStore(state => state.status);
  const logoutUser = useAuthStore(state => state.logoutUser);
  // const navigate = useNavigate()
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }
  console.log({user})

  return (
    <div id="menu" className=" min-w-[20rem] bg-gray-900 min-h-screen z-10 text-slate-300 w-80 left-0 overflow-y-scroll">
      <div id='logo' className="my-4 px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white">
          Gateway
          <span className="text-blue-500 text-xs"> Corp.</span>
        </h1>
        <p className="text-slate-500 text-sm">Tu mejor alternativa en idiomas.</p>
      </div>

      {/*  Profile */}
      <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Bienvenid@ ,</p>
        <a href="#" className="inline-flex space-x-2 items-center">
          <span>
            <img className="rounded-full w-8 h-8" src={user?.photoUrl ?? 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80'} alt="" />
          </span>
          <span className="text-sm md:text-base font-bold">
            {user?.name ?? ''}
          </span>
        </a>
      </div>

      {/* Menu Items */}
      <nav id="nav" className="w-full px-6">
        {
          menuItems.map(item => (
            <SideMenuItem key={item.href} {...item} />
          ))
        }

        {/**Logout */}
        <div className="mt-10" onClick={() => {
          logoutUser();
          // navigate('/')
        }}>
          <div>
            <IoLogOutOutline />
          </div>
          <div className="flex flex-col">
            <span className="text-lg text-slate-300 font-bold leading-5">Logout</span>
            <span className="text-sm text-slate-500 hidden md:block">Cerrar sesión</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
