import { FaGraduationCap } from "react-icons/fa";
import { TableGeneric } from "../tables/TableGeneric";
import { progressClassesInterface } from "../../../interface/progresssheet.interface";
import { ColumnDef } from "@tanstack/react-table";

interface ProgressClassesTableProps {
  progressClasses: progressClassesInterface[];
  columns: ColumnDef<progressClassesInterface>[];
}

export const ProgressClassesTable = ({ progressClasses, columns }: ProgressClassesTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaGraduationCap className="text-2xl" />
          Progress Classes
        </h2>
        <p className="text-green-100 text-sm mt-1">
          {progressClasses.length} {progressClasses.length === 1 ? 'clase registrada' : 'clases registradas'}
        </p>
      </div>
      <div className="p-6">
        <TableGeneric 
          columns={columns} 
          data={progressClasses} 
        />
      </div>
    </div>
  );
};
