import { useMemo, useState, useCallback } from "react";
import { level } from "../../interface"
import { useAuthStore, useLevelStore } from "../../stores";
import { FormLevel } from "../../components/shared/forms";
import Swal from "sweetalert2";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoPencil, IoTrash } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditLevelControl } from "../../components/shared/forms/EditLevelControl";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { ColumnDef } from "@tanstack/react-table";
import { exportLevelsToExcel } from "../../helpers/excel.helper";


export const LevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const levels = useLevelStore(state => state.levels);
  const updateLevel = useLevelStore(state => state.updateLevel);
  const deleteLevel = useLevelStore(state => state.deleteLevel);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState<string>();

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportLevelsToExcel(levels);
      
      if (success) {
        Swal.fire({
          title: "¡Éxito!",
          text: "El archivo Excel ha sido descargado exitosamente",
          icon: "success",
          confirmButtonText: "Continuar"
        });
      } else {
        Swal.fire("Error", "No se pudo exportar el archivo Excel", "error");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire("Error", "Ocurrió un error al exportar el archivo", "error");
    }
  }, [levels]);

  const columns = useMemo<ColumnDef<level>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">
            {row.getValue('description') || 'Sin descripción'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: isAdmin ? 'Acciones' : 'Estado',
      cell: ({ row }) => {
        const level = row.original;
        
        if (!isAdmin) {
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              level.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {level.isActive ? 'Público' : 'Privado'}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <ToggleButton
              isActive={level.isActive}
              action={() => {
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: `Estás a punto de ${level.isActive ? 'ocultar' : 'mostrar'} esta modalidad`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, continuar',
                  cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await updateLevel({ ...level, isActive: !level.isActive });
                    window.location.reload();
                  }
                });
              }}
            />
            <FabButton 
              isActive 
              tootTipText="Editar modalidad" 
              action={() => {
                setOpenModal(true);
                setLevelToEdit(level.id);
              }} 
              Icon={IoPencil} 
            />
            <FabButton 
              isActive
              tootTipText="Eliminar modalidad"
              Icon={IoTrash}
              action={() => {
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: 'Estás a punto de eliminar esta modalidad',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, continuar',
                  cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await deleteLevel(level.id!);
                  }
                });
              }} 
            />
          </div>
        );
      },
    },
  ], [updateLevel, deleteLevel, isAdmin]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Modalidades
        </h1>
        
        {/* Modal para editar nivel */}
        {levelToEdit && (
          <ModalGeneric 
            title="Actualizar datos" 
            isVisible={openModal} 
            setIsVisible={setOpenModal} 
            children={<EditLevelControl levelId={levelToEdit} />} 
          />
        )}
        
        {/* Modal para agregar nueva modalidad */}
        {isAdmin && (
          <ModalGeneric 
            title="Crear Nueva Modalidad" 
            isVisible={openAddModal} 
            setIsVisible={setOpenAddModal} 
            children={<FormLevel />}
          />
        )}
        
        {/* Botón para agregar nueva modalidad */}
        {isAdmin && (
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleExportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                <MdFileDownload className="w-5 h-5" />
                Exportar Excel
              </button>
            </div>
            <button 
              onClick={() => setOpenAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              + Agregar Modalidad
            </button>
          </div>
        )}

        {/* Solo botón de exportación para no admin */}
        {!isAdmin && (
          <div className="mb-6 flex justify-end">
            <button 
              onClick={handleExportToExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              <MdFileDownload className="w-5 h-5" />
              Exportar Excel
            </button>
          </div>
        )}
        
        {/* Tabla con TableGeneric */}
        <TableGeneric
          columns={columns}
          data={levels}
          // hasActions={isAdmin}
        />
      </div>
    </>
  )
}
