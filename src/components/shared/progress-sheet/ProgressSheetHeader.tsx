import { FaFileContract } from "react-icons/fa";

interface ProgressSheetHeaderProps {
  studentName?: string;
  isTeacher?: boolean;
  onAddProgressSheet: () => void;
}

export const ProgressSheetHeader = ({ 
  studentName, 
  isTeacher, 
  onAddProgressSheet 
}: ProgressSheetHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Progress Sheet
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Estudiante: <span className="font-medium text-gray-900">{studentName}</span>
            </p>
          </div>
          {!isTeacher && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
              type="button"
              onClick={onAddProgressSheet}
            >
              <FaFileContract className="w-4 h-4" />
              Add Progress-Sheet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
