import { IoBarChart, IoBook, IoCalendar, IoLocate, IoPerson, IoPieChart, IoSpeedometerOutline } from "react-icons/io5";
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
  { title: 'Reservaciones', subTitle: 'Gestión de reservaciones', href: '/dashboard/events', Icon: IoCalendar, active: true },
  { title: 'Localidades', subTitle: 'Gestión de Lugares', href: '/dashboard/locations', Icon: IoLocate, active: true },
]

const student: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Información del Estudiante', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Clases', subTitle: 'Clases donde el estudiante se encuentra', href: '/dashboard/events', Icon: IoCalendar, active: true },
  { title: 'Unidades', subTitle: 'Unidades del estudiante', href: '/dashboard/sub-levels', Icon: IoBarChart, active: true },
  { title: 'Libros', subTitle: 'Material de apoyo', href: '/dashboard/units', Icon: IoBook, active: true },
]

const teacher: MenuItem[] = [
  { title: 'Dashboard', subTitle: 'Welcome Teacher', href: '/dashboard', Icon: IoSpeedometerOutline, active: true },
  { title: 'Reservaciones', subTitle: 'Gestión de reservaciones', href: '/dashboard/events', Icon: IoCalendar, active: true },
  { title: 'Libros', subTitle: 'Material de apoyo', href: '/dashboard/units', Icon: IoBook, active: true },

]


export const menuItemsByRole = (typeUser: role):MenuItem[] => {
  switch (typeUser) {
    case 'admin':
      return admin;
    case 'teacher':
      return teacher;
    case 'student':
      return student;
    default:
      return student;
  }

}
