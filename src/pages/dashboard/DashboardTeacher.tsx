import { FC } from "react";
import { useUnitStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBook, IoCalendar, IoTrendingUp, IoCheckmarkCircle, IoTime, IoLibrary, IoRibbon, IoPeople, IoStatsChart, IoPersonAdd, IoClipboard, IoTrophy, IoAnalytics } from "react-icons/io5";
import { FirestoreUser } from "../../interface";
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
export const DashboardTeacher: FC<Props> = ({ user }) => {
    const events = useEventStore(state => state.events);
    const units = useUnitStore(state => state.units);
    
    // Filtrar eventos del profesor
    const teacherEvents = events.filter(event => event.teacher === user.id);
    const activeEvents = teacherEvents.filter(event => event.isActive);
    const pastEvents = teacherEvents.filter(event => 
        event.date && 
        new Date(event.date) < new Date()
    );
    
    // Filtrar libros del profesor
    const booksTeacher = units.filter(unit => unit.isActive && (user.unitsForBooks || []).includes(unit.sublevel));
    
    // Calcular estudiantes únicos del profesor
    const uniqueStudents = new Set();
    teacherEvents.forEach(event => {
        Object.keys(event.students).forEach(studentId => {
            uniqueStudents.add(studentId);
        });
    });
    const totalStudents = uniqueStudents.size;
    
    // Calcular estadísticas de asistencia
    const totalStudentsAttended = pastEvents.reduce((acc, event) => {
        return acc + Object.values(event.students).filter(student => student.status === 'CONFIRMED').length;
    }, 0);
    
    const averageAttendance = pastEvents.length > 0 ? 
        (totalStudentsAttended / (pastEvents.length * Math.max(1, totalStudents))) * 100 : 0;
    
    // Eventos recientes (últimos 30 días)
    const recentEvents = pastEvents
        .filter(event => event.date && isAfter(new Date(event.date), subDays(new Date(), 30)))
        .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
        .slice(0, 5);
    
    // Próximos eventos
    const upcomingEvents = activeEvents
        .filter(event => event.date && new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        .slice(0, 5);
    
    // Datos para gráficos
    const classStatusData = {
        labels: ['Completadas', 'Activas', 'Canceladas'],
        datasets: [
            {
                data: [
                    pastEvents.filter(event => event.status === 'CONFIRMED').length,
                    activeEvents.length,
                    pastEvents.filter(event => event.status === 'DECLINED').length,
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthlyClassesData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Clases impartidas',
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

    const studentAttendanceData = {
        labels: ['Asistieron', 'No asistieron', 'Pendientes'],
        datasets: [
            {
                data: [
                    totalStudentsAttended,
                    pastEvents.reduce((acc, event) => {
                        return acc + Object.values(event.students).filter(student => student.status === 'DECLINED').length;
                    }, 0),
                    activeEvents.reduce((acc, event) => {
                        return acc + Object.values(event.students).filter(student => student.status === 'MAYBE').length;
                    }, 0),
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
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
            {/* Header del profesor */}
            <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">¡Bienvenido, Prof. {user.name}! 👨‍🏫</h1>
                            <p className="text-green-100">Panel de control para gestionar tus clases y estudiantes</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                                <IoTrophy className="text-yellow-300" size={20} />
                                <span className="text-sm font-medium">Profesor Activo</span>
                            </div>
                            <div className="text-xs text-green-200">
                                Actualizado: {format(new Date(), 'dd/MM/yyyy')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <WhiteCard className="border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Clases</p>
                            <p className="text-2xl font-bold text-gray-900">{teacherEvents.length}</p>
                            <div className="flex items-center mt-1">
                                <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                <span className="text-xs text-green-600">Impartidas</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                            <IoCalendar size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                            <div className="flex items-center mt-1">
                                <IoPeople className="text-blue-500 mr-1" size={14} />
                                <span className="text-xs text-blue-600">Únicos</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                            <IoPersonAdd size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Clases Activas</p>
                            <p className="text-2xl font-bold text-gray-900">{activeEvents.length}</p>
                            <div className="flex items-center mt-1">
                                <IoCheckmarkCircle className="text-purple-500 mr-1" size={14} />
                                <span className="text-xs text-purple-600">Programadas</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                            <IoClipboard size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Recursos</p>
                            <p className="text-2xl font-bold text-gray-900">{booksTeacher.length}</p>
                            <div className="flex items-center mt-1">
                                <IoLibrary className="text-orange-500 mr-1" size={14} />
                                <span className="text-xs text-orange-600">Libros</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                            <IoBook size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Tarjetas de métricas avanzadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WhiteCard className="border-l-4 border-emerald-500 hover:shadow-lg transition-all duration-300">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Promedio de Asistencia</p>
                                <p className="text-3xl font-bold text-emerald-600">{averageAttendance.toFixed(1)}%</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {totalStudentsAttended} estudiantes asistieron
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-full">
                                <IoAnalytics size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Efectividad</p>
                                <p className="text-3xl font-bold text-indigo-600">
                                    {pastEvents.length > 0 ? ((pastEvents.filter(e => e.status === 'CONFIRMED').length / pastEvents.length) * 100).toFixed(1) : 0}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Clases completadas exitosamente
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-full">
                                <IoStatsChart size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Gráficos de rendimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estado de clases */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full mr-3">
                                    <IoClipboard className="text-white" size={18} />
                                </div>
                                Estado de Clases
                            </h3>
                            <div className="text-sm text-gray-500">
                                {teacherEvents.length} clases total
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={classStatusData} options={chartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Asistencia de estudiantes */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-full mr-3">
                                    <IoPersonAdd className="text-white" size={18} />
                                </div>
                                Asistencia de Estudiantes
                            </h3>
                            <div className="text-sm text-gray-500">
                                {totalStudents} estudiantes
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={studentAttendanceData} options={chartOptions} />
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
                                Clases Mensuales
                            </h3>
                            <div className="text-sm text-gray-500">
                                {pastEvents.length} clases este año
                            </div>
                        </div>
                        <div className="h-64">
                            <Line data={monthlyClassesData} options={lineChartOptions} />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Actividad reciente y próximos eventos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clases recientes */}
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
                                            event.status === 'CONFIRMED' 
                                                ? 'bg-green-100 text-green-700' 
                                                : event.status === 'DECLINED' 
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {event.status === 'CONFIRMED' ? 'Completada' : 
                                             event.status === 'DECLINED' ? 'Cancelada' : 'Pendiente'}
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

                {/* Próximos eventos */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-full mr-3">
                                    <IoRibbon className="text-white" size={18} />
                                </div>
                                Próximas Clases
                            </h3>
                            <div className="text-sm text-gray-500">
                                {upcomingEvents.length} programadas
                            </div>
                        </div>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                                <IoCalendar size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {event.date && format(new Date(event.date), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {Object.keys(event.students).length} estudiantes
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoCalendar size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No hay clases programadas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </WhiteCard>
            </div>
        </div>
    );
};