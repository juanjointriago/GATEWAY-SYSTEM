/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  IoSearchOutline, 
  IoRefreshOutline, 
  IoCalendarOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoMailOutline,
  IoFilterOutline
} from 'react-icons/io5';
import { event } from '../../../interface';
import { 
  useUserStore, 
  useLevelStore, 
  useSubLevelStore 
} from '../../../stores';
import { useEventStore } from '../../../stores/events/event.store';
import { TableGeneric } from '../tables/TableGeneric';
import { ColumnDef } from '@tanstack/react-table';
import { NavLink } from 'react-router-dom';

// Interfaces para tipado fuerte
interface SearchFilters {
  dateFrom: string;
  dateTo: string;
  studentEmail: string;
  studentName: string;
  levelId: string;
  subLevelId: string;
  teacherId: string;
}

interface SearchResult {
  events: event[];
  totalCount: number;
  hasResults: boolean;
}

// Componente para mostrar "Sin resultados"
const NoResultsFound: FC = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-gray-100 rounded-full p-6 mb-6">
      <IoSearchOutline className="w-16 h-16 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No se encontraron resultados
    </h3>
    <p className="text-gray-500 text-center max-w-md">
      No hay reservaciones que coincidan con los criterios de búsqueda especificados.
      Intenta modificar los filtros o ampliar el rango de fechas.
    </p>
  </div>
);

// Componente para el estado de carga
const LoadingSearch: FC = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600">Buscando reservaciones...</p>
  </div>
);

// Hook personalizado para la lógica de búsqueda (SRP - Single Responsibility Principle)
const useAdvancedEventSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult>({
    events: [],
    totalCount: 0,
    hasResults: false
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Zustand stores
  const events = useEventStore((state) => state.events);
  const users = useUserStore((state) => state.users);

  // Función para aplicar filtros (Pure function)
  const applyFilters = useCallback((filters: SearchFilters): event[] => {
    const { dateFrom, dateTo, studentEmail, studentName, levelId, subLevelId, teacherId } = filters;

    return events.filter((event: event) => {
      // Filtro por rango de fechas
      if (dateFrom || dateTo) {
        const eventDate = new Date(event.date);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;
        
        if (fromDate && eventDate < fromDate) return false;
        if (toDate && eventDate > toDate) return false;
      }

      // Filtro por email de estudiante
      if (studentEmail) {
        const studentUser = users.find((u: any) => 
          u.email?.toLowerCase().includes(studentEmail.toLowerCase()) && 
          u.role === 'student'
        );
        if (!studentUser || !event.students[studentUser.id!]) return false;
      }

      // Filtro por nombre de estudiante
      if (studentName) {
        const studentsInEvent = Object.keys(event.students);
        const hasStudent = studentsInEvent.some(studentId => {
          const student = users.find((u: any) => u.id === studentId);
          return student?.name?.toLowerCase().includes(studentName.toLowerCase());
        });
        if (!hasStudent) return false;
      }

      // Filtro por nivel
      if (levelId && event.levels[0]?.level !== levelId) return false;

      // Filtro por subnivel
      if (subLevelId && !event.levels[0]?.subLevels.includes(subLevelId)) return false;

      // Filtro por profesor
      if (teacherId && event.teacher !== teacherId) return false;

      return true;
    });
  }, [events, users]);

  const performSearch = useCallback(async (filters: SearchFilters) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Simular delay de búsqueda para mejor UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredEvents = applyFilters(filters);
      
      setSearchResults({
        events: filteredEvents,
        totalCount: filteredEvents.length,
        hasResults: filteredEvents.length > 0
      });
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults({
        events: [],
        totalCount: 0,
        hasResults: false
      });
    } finally {
      setIsSearching(false);
    }
  }, [applyFilters]);

  const resetSearch = useCallback(() => {
    setSearchResults({
      events: [],
      totalCount: 0,
      hasResults: false
    });
    setHasSearched(false);
    setIsSearching(false);
  }, []);

  return {
    isSearching,
    searchResults,
    hasSearched,
    performSearch,
    resetSearch
  };
};

// Componente principal
export const AdvancedEventSearch: FC = () => {
  // Custom hook para la lógica de búsqueda
  const { 
    isSearching, 
    searchResults, 
    hasSearched, 
    performSearch, 
    resetSearch
  } = useAdvancedEventSearch();



  // Stores de Zustand
  const users = useUserStore(state => state.users);
  const levels = useLevelStore(state => state.levels);
  const subLevels = useSubLevelStore(state => state.subLevels);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm<SearchFilters>({
    defaultValues: {
      dateFrom: '',
      dateTo: '',
      studentEmail: '',
      studentName: '',
      levelId: '',
      subLevelId: '',
      teacherId: ''
    }
  });

  // Filtros de datos optimizados con useMemo
  const teachers = useMemo(() => 
    users.filter((user: any) => 
      (user.role === 'teacher' || user.role === 'admin') && user.isActive
    ),
    [users]
  );

  // Definición de columnas para la tabla de resultados
  const searchColumns = useMemo<ColumnDef<event>[]>(() => {
    return [
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => {
          const dateValue = info.getValue() as string;
          if (!dateValue) return "Sin fecha";
          const date = new Date(dateValue);
          return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        },
        header: () => <span className="flex items-center gap-2"><IoCalendarOutline />Fecha</span>,
      },
      {
        accessorKey: "name",
        cell: (info) => (
          <div className="font-medium text-gray-900 truncate max-w-40">
            {info.getValue() as string}
          </div>
        ),
        header: () => <span>Evento</span>,
      },
      {
        accessorKey: "teacher",
        cell: (info) => {
          const teacher = users.find(user => user.id === (info.getValue() as string));
          return (
            <div className="flex items-center gap-2">
              <IoPersonOutline className="text-gray-500" />
              <span className="text-sm">{teacher?.name || 'Sin asignar'}</span>
            </div>
          );
        },
        header: () => <span>Docente</span>,
      },
      {
        accessorKey: "students",
        cell: (info) => {
          const studentsCount = Object.keys(info.row.original.students).length;
          return (
            <div className="flex items-center gap-2">
              <IoSchoolOutline className="text-blue-500" />
              <span className="text-sm font-medium">{studentsCount}</span>
            </div>
          );
        },
        header: () => <span>Estudiantes</span>,
      },
      {
        accessorKey: "meetLink",
        cell: (info) => {
          const link = info.getValue() as string;
          return link ? (
            <NavLink
              to={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <span>Ir a reunión</span>
              <span>🔗</span>
            </NavLink>
          ) : (
            <span className="text-gray-400 text-sm">Sin enlace</span>
          );
        },
        header: () => <span>Enlace</span>,
      }
    ];
  }, [users]);

  // Handlers
  const onSubmit = handleSubmit((data) => {
    performSearch(data);
  });

  const handleReset = useCallback(() => {
    reset();
    resetSearch();
  }, [reset, resetSearch]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <IoFilterOutline className="text-blue-600" />
          Búsqueda Avanzada de Reservaciones
        </h2>
        <p className="text-gray-600 mt-1">
          Utiliza los filtros para encontrar reservaciones específicas
        </p>
      </div>

      {/* Formulario de Filtros */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Filtros de Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoCalendarOutline className="text-gray-500" />
              Fecha desde
            </label>
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoCalendarOutline className="text-gray-500" />
              Fecha hasta
            </label>
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            />
          </div>
        </div>

        {/* Filtros de Estudiantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoMailOutline className="text-gray-500" />
              Email del estudiante
            </label>
            <Controller
              name="studentEmail"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoPersonOutline className="text-gray-500" />
              Nombre del estudiante
            </label>
            <Controller
              name="studentName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Nombre completo o parcial"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            />
          </div>
        </div>

        {/* Filtros Académicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoSchoolOutline className="text-gray-500" />
              Nivel
            </label>
            <Controller
              name="levelId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Todos los niveles</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoSchoolOutline className="text-gray-500" />
              Subnivel
            </label>
            <Controller
              name="subLevelId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Todos los subniveles</option>
                  {subLevels.map(subLevel => (
                    <option key={subLevel.id} value={subLevel.id}>
                      {subLevel.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <IoPersonOutline className="text-gray-500" />
              Docente
            </label>
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Todos los docentes</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSearching}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-40"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Buscando...
              </>
            ) : (
              <>
                <IoSearchOutline className="w-5 h-5" />
                Buscar Reservaciones
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSearching}
            className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-40"
          >
            <IoRefreshOutline className="w-5 h-5" />
            Limpiar Filtros
          </button>
        </div>
      </form>

      {/* Resultados */}
      <div className="pt-6 border-t border-gray-200">
        {isSearching ? (
          <LoadingSearch />
        ) : hasSearched ? (
          searchResults.hasResults ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Resultados de Búsqueda
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {searchResults.totalCount} evento{searchResults.totalCount !== 1 ? 's' : ''} encontrado{searchResults.totalCount !== 1 ? 's' : ''}
                </span>
              </div>
              <TableGeneric
                columns={searchColumns}
                data={searchResults.events}
              />
            </>
          ) : (
            <NoResultsFound />
          )
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full p-6 inline-block mb-4">
              <IoSearchOutline className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configura tus filtros de búsqueda
            </h3>
            <p className="text-gray-500">
              Selecciona los criterios de búsqueda y presiona "Buscar Reservaciones" para ver los resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};