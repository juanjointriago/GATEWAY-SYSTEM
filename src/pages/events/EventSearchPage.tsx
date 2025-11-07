import { FC } from 'react';
import { AdvancedEventSearch } from '../../components/shared/search';

/**
 * Página de búsqueda avanzada de eventos
 * 
 * Esta página proporciona una interfaz completa para buscar eventos
 * utilizando múltiples criterios de filtrado como fechas, estudiantes,
 * niveles académicos y docentes.
 * 
 * Características:
 * - Búsqueda por rango de fechas
 * - Filtrado por email y nombre de estudiantes
 * - Selección por niveles y subniveles académicos
 * - Filtrado por docente asignado
 * - Resultados paginados y ordenados
 * - Estados de carga y sin resultados
 */
export const EventSearchPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Búsqueda de Reservaciones
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Encuentra Reservaciones específicos utilizando nuestros filtros avanzados. 
            Puedes buscar por fechas, estudiantes, niveles académicos y más.
          </p>
        </div>

        {/* Componente de búsqueda */}
        <AdvancedEventSearch />
        
        {/* Información adicional */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Consejos para una mejor búsqueda
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Utiliza rangos de fechas para delimitar tu búsqueda temporal</li>
            <li>• Puedes buscar por email o nombre parcial del estudiante</li>
            <li>• Combina múltiples filtros para resultados más específicos</li>
            <li>• Los filtros vacíos se ignoran automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventSearchPage;