import { FaFileContract } from "react-icons/fa";

interface EmptyProgressSheetProps {
  onCreateProgressSheet: () => void;
  showButton?: boolean;
}

export const EmptyProgressSheet = ({ onCreateProgressSheet, showButton = true }: EmptyProgressSheetProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="text-gray-400 mb-4">
        <FaFileContract size={64} className="mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No hay Progress Sheet disponible
      </h3>
      <p className="text-gray-600 mb-4">
        Aún no se ha creado un Progress Sheet para este estudiante.
      </p>
      {showButton && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
          type="button"
          onClick={onCreateProgressSheet}
        >
          Crear Progress Sheet
        </button>
      )}
    </div>
  );
};
