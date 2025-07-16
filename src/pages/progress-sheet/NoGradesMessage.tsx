import { FC } from 'react';
import { FaChalkboardTeacher, FaExclamationTriangle } from 'react-icons/fa';

interface NoGradesMessageProps {
  message?: string
}

export const NoGradesMessage: FC<NoGradesMessageProps> = ({ 
  message = "Puedes solicitar a tu docente que califique tus asistencias para acceder a tu progress sheet." 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-white text-2xl" />
          <div>
            <h2 className="text-xl font-bold text-white">Progress Classes</h2>
            <p className="text-yellow-100 text-sm">
              Calificaciones pendientes
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          {/* Icono animado */}
          <div className="text-orange-500 animate-bounce">
            <FaChalkboardTeacher size={80} className="mx-auto" />
          </div>

          {/* Mensaje principal */}
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 
            bg-clip-text text-transparent">
            ¡Calificaciones Pendientes!
          </h3>

          {/* Mensaje descriptivo */}
          <p className="text-lg text-gray-600 leading-relaxed">
            Aún no se han calificado tus asistencias, por lo que no puedes ver tu progress sheet completo.
          </p>

          {/* Sugerencia */}
          <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-3">
              <FaChalkboardTeacher className="text-orange-500 text-xl mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">¿Qué puedes hacer?</h4>
                <p className="text-orange-700">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Información adicional</h4>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Las calificaciones se actualizan regularmente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Una vez calificadas, podrás ver tu progreso detallado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Contacta a tu docente si tienes dudas
              </li>
            </ul>
          </div>

          {/* Decoración */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75"></span>
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse delay-150"></span>
          </div>
        </div>
      </div>
    </div>
  );
};