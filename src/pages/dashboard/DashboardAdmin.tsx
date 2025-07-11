import { FC } from "react";
import { useLevelStore, useUnitStore, useUserStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBarChart, IoBook, IoCalendar, IoCashOutline, IoPerson, IoPersonAddOutline, IoPersonRemove, IoTrendingUp, IoTrendingDown, IoStatsChart, IoAnalytics, IoSchool, IoSparkles, IoTime, IoGlobe } from "react-icons/io5";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";
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
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { format, isAfter, isBefore, startOfYear, endOfYear } from 'date-fns';

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

export const DashboardAdmin: FC = () => {
    const users = useUserStore(state => state.users);
    const levels = useLevelStore(state => state.levels);
    const events = useEventStore(state => state.events);
    const units = useUnitStore(state => state.units);
    const fees = useFeesStore(state => state.fees);
    const progressSheets = useProgressSheetStore(state => state.progressSheets);

    // Calcular estadísticas del año actual y anterior
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    const currentYearStart = startOfYear(new Date(currentYear, 0, 1));
    const currentYearEnd = endOfYear(new Date(currentYear, 11, 31));
    const previousYearStart = startOfYear(new Date(previousYear, 0, 1));
    const previousYearEnd = endOfYear(new Date(previousYear, 11, 31));

    // Estadísticas de usuarios
    const studentsThisYear = users.filter(user => 
        user.role === 'student' && 
        user.createdAt && 
        isAfter(new Date(user.createdAt), currentYearStart) &&
        isBefore(new Date(user.createdAt), currentYearEnd)
    ).length;

    const studentsLastYear = users.filter(user => 
        user.role === 'student' && 
        user.createdAt && 
        isAfter(new Date(user.createdAt), previousYearStart) &&
        isBefore(new Date(user.createdAt), previousYearEnd)
    ).length;

    const teachersThisYear = users.filter(user => 
        user.role === 'teacher' && 
        user.createdAt && 
        isAfter(new Date(user.createdAt), currentYearStart) &&
        isBefore(new Date(user.createdAt), currentYearEnd)
    ).length;

    const teachersLastYear = users.filter(user => 
        user.role === 'teacher' && 
        user.createdAt && 
        isAfter(new Date(user.createdAt), previousYearStart) &&
        isBefore(new Date(user.createdAt), previousYearEnd)
    ).length;

    // Estadísticas de eventos
    const eventsThisYear = events.filter(event => 
        event.createdAt && 
        isAfter(new Date(event.createdAt), currentYearStart) &&
        isBefore(new Date(event.createdAt), currentYearEnd)
    ).length;

    const eventsLastYear = events.filter(event => 
        event.createdAt && 
        isAfter(new Date(event.createdAt), previousYearStart) &&
        isBefore(new Date(event.createdAt), previousYearEnd)
    ).length;

    // Estadísticas de fees
    const feesThisYear = fees.filter(fee => 
        fee.createdAt && 
        isAfter(new Date(fee.createdAt), currentYearStart) &&
        isBefore(new Date(fee.createdAt), currentYearEnd)
    ).length;

    const feesLastYear = fees.filter(fee => 
        fee.createdAt && 
        isAfter(new Date(fee.createdAt), previousYearStart) &&
        isBefore(new Date(fee.createdAt), previousYearEnd)
    ).length;

    // Calcular porcentajes de cambio
    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const studentsGrowth = calculateGrowth(studentsThisYear, studentsLastYear);
    const teachersGrowth = calculateGrowth(teachersThisYear, teachersLastYear);
    const eventsGrowth = calculateGrowth(eventsThisYear, eventsLastYear);
    const feesGrowth = calculateGrowth(feesThisYear, feesLastYear);

    // Datos para gráficos
    const userComparisonData = {
        labels: ['Estudiantes', 'Docentes'],
        datasets: [
            {
                label: `${previousYear}`,
                data: [studentsLastYear, teachersLastYear],
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
            },
            {
                label: `${currentYear}`,
                data: [studentsThisYear, teachersThisYear],
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyEventsData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Eventos por mes',
                data: Array.from({ length: 12 }, (_, i) => {
                    return events.filter(event => {
                        if (!event.createdAt) return false;
                        const eventDate = new Date(event.createdAt);
                        return eventDate.getFullYear() === currentYear && 
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

    const userStatusData = {
        labels: ['Activos', 'Inactivos'],
        datasets: [
            {
                data: [
                    users.filter(user => user.isActive === true).length,
                    users.filter(user => user.isActive === false).length,
                ],
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

    const programDistribution = {
        labels: ['English for Kids', 'English for EveryBody', 'TOELF', 'IELTS', 'Certificaciones'],
        datasets: [
            {
                data: [
                    progressSheets.filter(ps => ps.program?.includes('English for Kids')).length,
                    progressSheets.filter(ps => ps.program?.includes('English for EveryBody')).length,
                    progressSheets.filter(ps => ps.program?.includes('TOELF')).length,
                    progressSheets.filter(ps => ps.program?.includes('IELTS')).length,
                    progressSheets.filter(ps => 
                        ps.program?.includes('Certification A1') || 
                        ps.program?.includes('Certification A2') ||
                        ps.program?.includes('Certification B1') ||
                        ps.program?.includes('Certification B2') ||
                        ps.program?.includes('Certification C1')
                    ).length,
                ],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Calcular actividad reciente
    const recentUsers = users
        .filter(user => user.createdAt && isAfter(new Date(user.createdAt), new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);

    const recentEvents = events
        .filter(event => event.createdAt && isAfter(new Date(event.createdAt), new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);

    const chartOptions = {
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

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Header con efecto de gradiente y estadísticas adicionales */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue to-gray-800 rounded-lg p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-indigo-100">Dashboard Administrativo</h1>
                            <p className="text-indigo-100">Resumen estadístico del sistema educativo</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                                <IoSparkles className="text-yellow-300" size={20} />
                                <span className="text-sm font-medium">Año {currentYear}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <IoTime className="text-blue-300" size={16} />
                                <span className="text-xs">Actualizado: {format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs Cards con efectos hover y gradientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <WhiteCard className="border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            <div className="flex items-center mt-1">
                                <IoGlobe className="text-indigo-500 mr-1" size={14} />
                                <span className="text-xs text-gray-500">Sistema activo</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-full">
                            <IoPerson size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.role === 'student').length}
                            </p>
                            <div className="flex items-center mt-1">
                                {studentsGrowth >= 0 ? (
                                    <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                ) : (
                                    <IoTrendingDown className="text-red-500 mr-1" size={14} />
                                )}
                                <span className={`text-xs ${studentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {studentsGrowth.toFixed(1)}% vs {previousYear}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
                            <IoSchool size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Docentes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.role === 'teacher').length}
                            </p>
                            <div className="flex items-center mt-1">
                                {teachersGrowth >= 0 ? (
                                    <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                ) : (
                                    <IoTrendingDown className="text-red-500 mr-1" size={14} />
                                )}
                                <span className={`text-xs ${teachersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {teachersGrowth.toFixed(1)}% vs {previousYear}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                            <IoPersonAddOutline size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Eventos</p>
                            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                            <div className="flex items-center mt-1">
                                {eventsGrowth >= 0 ? (
                                    <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                ) : (
                                    <IoTrendingDown className="text-red-500 mr-1" size={14} />
                                )}
                                <span className={`text-xs ${eventsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {eventsGrowth.toFixed(1)}% vs {previousYear}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
                            <IoCalendar size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Additional Stats con gradientes y efectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <WhiteCard className="border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Recaudaciones</p>
                            <p className="text-2xl font-bold text-gray-900">{fees.length}</p>
                            <div className="flex items-center mt-1">
                                {feesGrowth >= 0 ? (
                                    <IoTrendingUp className="text-green-500 mr-1" size={14} />
                                ) : (
                                    <IoTrendingDown className="text-red-500 mr-1" size={14} />
                                )}
                                <span className={`text-xs ${feesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {feesGrowth.toFixed(1)}% vs {previousYear}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full">
                            <IoCashOutline size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Recursos</p>
                            <p className="text-2xl font-bold text-gray-900">{units.length}</p>
                            <div className="flex items-center mt-1">
                                <IoBook className="text-red-500 mr-1" size={14} />
                                <span className="text-xs text-gray-500">Unidades académicas</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full">
                            <IoBook size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Modalidades</p>
                            <p className="text-2xl font-bold text-gray-900">{levels.length}</p>
                            <div className="flex items-center mt-1">
                                <IoBarChart className="text-orange-500 mr-1" size={14} />
                                <span className="text-xs text-gray-500">Niveles disponibles</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                            <IoBarChart size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inactivos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.isActive === false).length}
                            </p>
                            <div className="flex items-center mt-1">
                                <IoPersonRemove className="text-teal-500 mr-1" size={14} />
                                <span className="text-xs text-gray-500">Usuarios deshabilitados</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 rounded-full">
                            <IoPersonRemove size={24} className="text-white" />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Charts Section con estilos mejorados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparación de Usuarios */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full mr-3">
                                    <IoStatsChart className="text-white" size={18} />
                                </div>
                                Comparación Anual de Usuarios
                            </h3>
                            <div className="text-sm text-gray-500">
                                {previousYear} vs {currentYear}
                            </div>
                        </div>
                        <div className="h-64">
                            <Bar data={userComparisonData} options={chartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Estado de Usuarios */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full mr-3">
                                    <IoAnalytics className="text-white" size={18} />
                                </div>
                                Estado de Usuarios
                            </h3>
                            <div className="text-sm text-gray-500">
                                Total: {users.length} usuarios
                            </div>
                        </div>
                        <div className="h-64">
                            <Doughnut data={userStatusData} options={pieChartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Eventos Mensuales */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-full mr-3">
                                    <IoCalendar className="text-white" size={18} />
                                </div>
                                Eventos por Mes ({currentYear})
                            </h3>
                            <div className="text-sm text-gray-500">
                                Total: {eventsThisYear} eventos
                            </div>
                        </div>
                        <div className="h-64">
                            <Line data={monthlyEventsData} options={chartOptions} />
                        </div>
                    </div>
                </WhiteCard>

                {/* Distribución de Programas */}
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-full mr-3">
                                    <IoBook className="text-white" size={18} />
                                </div>
                                Distribución de Programas
                            </h3>
                            <div className="text-sm text-gray-500">
                                Total: {progressSheets.length} matrículas
                            </div>
                        </div>
                        <div className="h-64">
                            <Pie data={programDistribution} options={pieChartOptions} />
                        </div>
                    </div>
                </WhiteCard>
            </div>

            {/* Year Comparison Summary con diseño mejorado */}
            <WhiteCard className="hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-full mr-3">
                                <IoStatsChart className="text-white" size={18} />
                            </div>
                            Resumen Comparativo {previousYear} vs {currentYear}
                        </h3>
                        <div className="text-sm text-gray-500">
                            Métricas anuales
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-green-900">Nuevos Estudiantes</h4>
                                <IoSchool className="text-green-600" size={20} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-green-700">{previousYear}:</span>
                                    <span className="text-sm font-medium text-green-900">{studentsLastYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-green-700">{currentYear}:</span>
                                    <span className="text-sm font-medium text-green-900">{studentsThisYear}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-900">Nuevos Docentes</h4>
                                <IoPersonAddOutline className="text-blue-600" size={20} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-700">{previousYear}:</span>
                                    <span className="text-sm font-medium text-blue-900">{teachersLastYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-700">{currentYear}:</span>
                                    <span className="text-sm font-medium text-blue-900">{teachersThisYear}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-purple-900">Eventos Creados</h4>
                                <IoCalendar className="text-purple-600" size={20} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-purple-700">{previousYear}:</span>
                                    <span className="text-sm font-medium text-purple-900">{eventsLastYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-purple-700">{currentYear}:</span>
                                    <span className="text-sm font-medium text-purple-900">{eventsThisYear}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-yellow-900">Recaudaciones</h4>
                                <IoCashOutline className="text-yellow-600" size={20} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-yellow-700">{previousYear}:</span>
                                    <span className="text-sm font-medium text-yellow-900">{feesLastYear}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-yellow-700">{currentYear}:</span>
                                    <span className="text-sm font-medium text-yellow-900">{feesThisYear}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </WhiteCard>

            {/* Actividad Reciente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-full mr-3">
                                    <IoTime className="text-white" size={18} />
                                </div>
                                Usuarios Recientes
                            </h3>
                            <div className="text-sm text-gray-500">
                                Últimos 30 días
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                user.role === 'student' ? 'bg-green-100 text-green-600' : 
                                                user.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                                {user.role === 'student' ? (
                                                    <IoSchool size={16} />
                                                ) : user.role === 'teacher' ? (
                                                    <IoPersonAddOutline size={16} />
                                                ) : (
                                                    <IoPerson size={16} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.createdAt && format(new Date(user.createdAt), 'dd/MM/yyyy')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoTime size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No hay usuarios recientes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </WhiteCard>

                <WhiteCard className="hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-full mr-3">
                                    <IoCalendar className="text-white" size={18} />
                                </div>
                                Eventos Recientes
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
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                                <IoCalendar size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{event.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {event.date && format(new Date(event.date), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {event.createdAt && format(new Date(event.createdAt), 'dd/MM/yyyy')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <IoCalendar size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No hay eventos recientes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </WhiteCard>
            </div>
        </div>
    );
};