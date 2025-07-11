import { FC } from "react";
import { FirestoreUser } from "../../interface";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBarChart, IoBook, IoCalendar, IoPieChart, IoTrendingUp, IoCheckmarkCircle, IoTime, IoLibrary, IoRibbon, IoStatsChart } from "react-icons/io5";
import { LevelById } from "../levels/LevelById";
import { useUnitStore } from "../../stores";
import { SubLevelById } from "../sublevels/SubLevelById";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { format, isAfter, subDays } from 'date-fns';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface Props {
    user: FirestoreUser
}
export const DashboardStudent: FC<Props> = ({ user }) => {
    const events = useEventStore(state => state.events);
    const units = useUnitStore(state => state.units);
    
    // Filtrar eventos del estudiante
    const eventsStudent = events.filter(event => event.students[user.id!] && event.isActive);
    const pastEvents = events.filter(event => 
        event.students[user.id!] && 
        event.date && 
        new Date(event.date) < new Date()
    );
    
    // Filtrar libros del estudiante
    const booksStudent = units.filter(unit => unit.isActive && (user.unitsForBooks || []).includes(unit.sublevel));
    
    // Calcular progreso académico
    const totalClasses = pastEvents.length;
    const attendedClasses = pastEvents.filter(event => event.students[user.id!]?.status === 'CONFIRMED').length;
    const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    
    // Eventos recientes (últimos 30 días)
    const recentEvents = pastEvents
        .filter(event => event.date && isAfter(new Date(event.date), subDays(new Date(), 30)))
        .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
        .slice(0, 5);
    
    // Datos para gráficos
    const attendanceData = {
        labels: ['Asistidas', 'Faltadas'],
        datasets: [
            {
                data: [attendedClasses, totalClasses - attendedClasses],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthlyActivityData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Clases por mes',
                data: Array.from({ length: 12 }, (_, i) => {
                    return pastEvents.filter(event => {
                        if (!event.date) return false;
                        const eventDate = new Date(event.date);
                        return eventDate.getFullYear() === new Date().getFullYear() && 
                               eventDate.getMonth() === i;
                    }).length;
                }),
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 1)',
                tension: 0.4,
            },
        ],
    };

    const bookProgressData = {
        labels: ['Completados', 'En progreso', 'Pendientes'],
        datasets: [
            {
                data: [
                    Math.floor(booksStudent.length * 0.3), // Simulado - completados
                    Math.floor(booksStudent.length * 0.5), // Simulado - en progreso
                    Math.floor(booksStudent.length * 0.2), // Simulado - pendientes
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(156, 163, 175, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Header del estudiante */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">¡Hola, {user.name}! 👋</h1>
                            <p className="text-blue-100">Aquí tienes un resumen de tu progreso académico</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                                <IoRibbon className="text-yellow-300" size={20} />
                                <span className="text-sm font-medium">Estudiante Activo</span>
                            </div>
                            <div className="text-xs text-blue-200">
                                Actualizado: {format(new Date(), 'dd/MM/yyyy')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <WhiteCard className="border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Modalidad</p>
                            <div className="text-lg font-bold text-gray-900">
                                {user && user.level ? <LevelById levelId={user.level} /> : "Sin asignar"}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                            <IoPieChart size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Clases Reservadas</p>
                            <p className="text-2xl font-bold text-gray-900">{eventsStudent.length}</p>
                            <div className="flex items-center mt-1">
                                <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                <span className="text-xs text-green-600">Activas</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                            <IoCalendar size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Unidad Actual</p>
                            <div className="text-lg font-bold text-gray-900">
                                {user && user.subLevel ? <SubLevelById subLevelId={user.subLevel} /> : 'Sin asignar'}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                            <IoBarChart size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Libros Asignados</p>
                            <p className="text-2xl font-bold text-gray-900">{booksStudent.length}</p>
                            <div className="flex items-center mt-1">
                                <IoLibrary className="text-orange-500 mr-1" size={14} />
                                <span className="text-xs text-orange-600">Disponibles</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                            <IoBook size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Gráficos de rendimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asistencia */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full mr-3">
                                    <IoCheckmarkCircle className="text-white" size={18} />
                                </div>
                                Asistencia
                            </h3>
                            <div className="text-sm text-gray-500">
                                {attendanceRate.toFixed(1)}% de asistencia
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={attendanceData} options={chartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Progreso de libros */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-full mr-3">
                                    <IoBook className="text-white" size={18} />
                                </div>
                                Progreso de Libros
                            </h3>
                            <div className="text-sm text-gray-500">
                                {booksStudent.length} libros
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={bookProgressData} options={chartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Actividad mensual */}
                <WhiteCard className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-full mr-3">
                                    <IoStatsChart className="text-white" size={18} />
                                </div>
                                Actividad Mensual
                            </h3>
                            <div className="text-sm text-gray-500">
                                {totalClasses} clases este año
                            </div>
                        </div>
                        <div className="h-64">
                            <Line data={monthlyActivityData} options={lineChartOptions} />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Eventos recientes y libros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Eventos recientes */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full mr-3">
                                    <IoTime className="text-white" size={18} />
                                </div>
                                Clases Recientes
                            </h3>
                            <div className="text-sm text-gray-500">
                                Últimos 30 días
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentEvents.length > 0 ? (
                                recentEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <IoCalendar size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {event.date && format(new Date(event.date), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            event.students[user.id!]?.status === 'CONFIRMED' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {event.students[user.id!]?.status === 'CONFIRMED' ? 'Asistido' : 'Pendiente'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoTime size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No hay clases recientes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </WhiteCard>

                {/* Libros asignados */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-full mr-3">
                                    <IoLibrary className="text-white" size={18} />
                                </div>
                                Mis Libros
                            </h3>
                            <div className="text-sm text-gray-500">
                                {booksStudent.length} disponibles
                            </div>
                        </div>
                        <div className="space-y-3">
                            {booksStudent.length > 0 ? (
                                booksStudent.slice(0, 5).map((book) => (
                                    <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                                <IoBook size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{book.name}</div>
                                                <div className="text-sm text-gray-500">{book.sublevel}</div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            Disponible
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoBook size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No tienes libros asignados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </WhiteCard>
            </div>
        </div>
    );
};