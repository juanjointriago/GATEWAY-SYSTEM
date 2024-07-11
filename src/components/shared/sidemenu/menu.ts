import { IoBarChart, IoBook, IoCalendar, IoPerson, IoPieChart, IoSpeedometerOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { role } from "../../../interface";

interface MenuItem {
  title: string;
  subTitle: string;
  href: string;
  Icon: IconType;
  active?: boolean;
}

const admin: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Estadisticas del sitio', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Libros', subTitle: 'Material de apoyo', href: '/dashboard/units', Icon: IoBook, active: true },
  { title: 'Usuarios', subTitle: 'Gestión de usuarios', href: '/dashboard/users', Icon: IoPerson, active: true },
  { title: 'Modalidades', subTitle: 'Control de modalidades', href: '/dashboard/levels', Icon: IoPieChart, active: true },
  { title: 'Unidades', subTitle: 'Gestión de unidades', href: '/dashboard/sub-levels', Icon: IoBarChart, active: true },
  { title: 'Reservaciones', subTitle: 'Creación de reservaciones', href: '/dashboard/events', Icon: IoCalendar, active: true },
]

const student: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Welcome teacher', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Libros', subTitle: 'Material de apoyo', href: '/dashboard/units', Icon: IoBook, active: true },
  { title: 'Modalidades', subTitle: 'Control de modalidades', href: '/dashboard/levels', Icon: IoPieChart, active: true },
  { title: 'Unidades', subTitle: 'Gestión de unidades', href: '/dashboard/sub-levels', Icon: IoBarChart, active: true },
]

const teacher: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Welcome student', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Libros', subTitle: 'Material de apoyo', href: '/dashboard/units', Icon: IoBook, active: true },
  { title: 'Modalidades', subTitle: 'Control de modalidades', href: '/dashboard/levels', Icon: IoPieChart, active: true },
  { title: 'Unidades', subTitle: 'Gestión de unidades', href: '/dashboard/sub-levels', Icon: IoBarChart, active: true },

]


export const menuItemsByRole = (typeUser: role):MenuItem[] => {
  switch (typeUser) {
    case 'admin':
      return admin;
    case 'teacher':
      return student;
    case 'student':
      return teacher;
    default:
      return student;
  }

}
