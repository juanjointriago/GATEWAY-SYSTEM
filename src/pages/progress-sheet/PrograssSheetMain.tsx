import { FC } from 'react';
import { useAuthStore, useUserStore } from '../../stores';
import { StudentProgressSheet } from './StudentProgressSheet';
import { FaGraduationCap } from 'react-icons/fa';
import { TableGeneric } from '../../components/shared/tables/TableGeneric';
import { FirestoreUser } from '../../interface';

export const ProgressSheetMain: FC = () => {
  const user  = useAuthStore(state=>state.user);
  const users  = useUserStore(state=>state.users);

  // Si el usuario es estudiante, mostrar su progress sheet
  if (user?.role === 'student' && user.uid) {
    console.debug('Mostrando Progress Sheet para el estudiante:', user.uid);
    return <StudentProgressSheet studentID={user.uid} />;
  }

  // Filtrar solo estudiantes para la tabla
  const students = users.filter(user => user.role === 'student');

  const columns = [
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Correo',
      accessorKey: 'email',
    },
    {
      header: 'Unidad Actual',
      accessorKey: 'currentUnit',
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }: { row: { original: FirestoreUser } }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.isActive === true 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.isActive === true ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Progress Sheet',
      accessorKey: 'actions',
      cell: ({ row }: { row: { original: FirestoreUser } }) => (
        <button
          onClick={() => handleViewProgressSheet(row.original.uid)}
          className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors
            hover:bg-indigo-50 rounded-full"
          title="Ver Progress Sheet"
        >
          <FaGraduationCap size={20} />
        </button>
      ),
    },
  ];

  const handleViewProgressSheet = (studentId: string) => {
    console.log('Ver Progress Sheet del estudiante:', studentId);
    // Aquí puedes agregar la lógica para navegar o mostrar el progress sheet
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Progress Sheet - Estudiantes
        </h1>
      </div>
      
      <TableGeneric
        data={students}
        columns={columns}
      />
    </div>
  );
};
