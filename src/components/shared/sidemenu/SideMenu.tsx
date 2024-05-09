import { IconType } from "react-icons";
import { IoCalculatorSharp, IoLogOutOutline, IoPerson, IoSpeedometerOutline, IoSubway } from 'react-icons/io5'
import { SideMenuItem } from "./SideMenuItem";


interface MenuItem {
  title: string;
  subTitle: string;
  href: string;
  Icon: IconType
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Estadisticas del sitio', href: '/dashboard', Icon: IoSpeedometerOutline },
  { title: 'Usuarios', subTitle: 'Listado de usuarios', href: '/users', Icon: IoPerson },
  { title: 'Niveles', subTitle: '', href: '/levels', Icon: IoCalculatorSharp },
  { title: 'Sub-Niveles', subTitle: '', href: '/sub-levels', Icon: IoSubway },

]


export const SideMenu = () => {
  return (
    <div id="menu" className="bg-gray-900 min-h-screen z-10 text-slate-300 w-80 left-0 overflow-y-scroll">
      <div id='logo' className="my-4 px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white">
          Gateway
          <span className="text-blue-500 text-xs">English</span>
          .
        </h1>
        <p className="text-slate-500 text-sm">Tu mejor alternativa en idiomas.</p>
      </div>

      {/*  Profile */}
      <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Bienvenid@ ,</p>
        <a href="#" className="inline-flex space-x-2 items-center">
          <span>
            <img className="rounded-full w-8 h-8" src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80" alt="" />
          </span>
          <span className="text-sm md:text-base font-bold">
            Datos de sesión
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
        <div>
          <IoLogOutOutline />
        </div>
        <div className="flex flex-col">
          <span className="text-lg text-slate-300 font-bold leading-5">Logout</span>
          <span className="text-sm text-slate-500 hidden md:block">Cerrar Sesión</span>
        </div>


      </nav>
    </div>
  )
}
