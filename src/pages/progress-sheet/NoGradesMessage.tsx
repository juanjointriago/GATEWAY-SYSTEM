import { FC } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';

interface NoGradesMessageProps {
  message?: string
}
export const NoGradesMessage: FC<NoGradesMessageProps> = ({ message ="Puedes solicitar a tu docente que califique tus asistencias para acceder a tu progress sheet." }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        {/* Icono animado */}
        <div className="text-indigo-500 animate-bounce">
          <FaChalkboardTeacher size={80} />
        </div>

        {/* Mensaje principal */}
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
          bg-clip-text text-transparent">
          ¡Calificaciones Pendientes!
        </h2>

        {/* Mensaje descriptivo */}
        <p className="text-xl text-gray-600 leading-relaxed">
          Aún no se han calificado tus asistencias, por lo que no puedes ver tu progress sheet.
        </p>

        {/* Sugerencia */}
        <div className="bg-indigo-50 rounded-lg p-6 mt-8">
          <p className="text-lg text-indigo-700">
            {message}
          </p>
        </div>

        {/* Decoración */}
        <div className="flex justify-center gap-2 mt-4">
          <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="w-3 h-3 rounded-full bg-purple-600 animate-pulse delay-75"></span>
          <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse delay-150"></span>
        </div>
      </div>
    </div>
  );
};