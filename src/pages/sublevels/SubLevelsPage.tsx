import { IoPencil, IoTrash } from "react-icons/io5"
import { MdFileDownload } from "react-icons/md"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { SublevelForm } from "../../components/shared/forms/SublevelForm"
import { TableGeneric } from "../../components/shared/tables/TableGeneric"
import { subLevel } from "../../interface"
import { useAuthStore, useSubLevelStore } from "../../stores"
// import { LevelById } from "../levels/LevelById"
import { useMemo, useState, useCallback } from "react"
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric"
import { EditSubLEvelForm } from "../../components/shared/forms/EditSubLEvelForm"
import Swal from "sweetalert2"
import { ToggleButton } from "../../components/shared/buttons/ToggleButton"
import { ColumnDef } from "@tanstack/react-table"
import { exportSublevelsToExcel } from "../../helpers/excel.helper"

export const SubLevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const updateSublevel = useSubLevelStore(state => state.updateSubLevel);
  const deleteSubLevel = useSubLevelStore(state => state.deleteSubLevel);
  const isAdmin = user && user.role === 'admin';
  const subLevels = useSubLevelStore(state => state.subLevels);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [subLevelToEdit, setSsubLevelToEdit] = useState<string>();

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportSublevelsToExcel(subLevels);
      
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
  }, [subLevels]);

  const columns = useMemo<ColumnDef<subLevel>[]>(() => [
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {new Date(row.getValue('createdAt')).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      ),
    },
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
      accessorKey: 'isActive',
      header: isAdmin ? 'Acciones' : 'Estado',
      cell: ({ row }) => {
        const subLevel = row.original;
        
        if (!isAdmin) {
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              subLevel.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {subLevel.isActive ? 'Disponible' : 'No disponible'}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <ToggleButton
              isActive={subLevel.isActive}
              action={() => {
                console.debug(subLevel);
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: `Estas a punto de ${subLevel.isActive ? 'ocultar' : 'mostrar'} esta Unidad`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, continuar',
                  cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    console.debug('data for update', { ...subLevel, isActive: !subLevel.isActive });
                    await updateSublevel({ ...subLevel, isActive: !subLevel.isActive });
                    window.location.reload();
                  }
                });
              }}
            />
            <FabButton 
              isActive 
              tootTipText="Editar unidad" 
              action={() => {
                setOpenModal(true);
                setSsubLevelToEdit(subLevel.id);
              }} 
              Icon={IoPencil} 
            />
            <FabButton 
              isActive
              tootTipText="Eliminar unidad"
              Icon={IoTrash}
              action={() => {
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: `Estas a punto de eliminar esta Unidad (Sub-Nivel)`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, continuar',
                  cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await deleteSubLevel(subLevel.id!);
                  }
                });
              }} 
            />
          </div>
        );
      },
    },
  ], [updateSublevel, deleteSubLevel, isAdmin]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Unidades
        </h1>
        
        {/* Modal para editar sublevel */}
        {subLevelToEdit && (
          <ModalGeneric 
            title="Actualizar datos" 
            isVisible={openModal} 
            setIsVisible={setOpenModal} 
            children={<EditSubLEvelForm subLevelId={subLevelToEdit} />} 
          />
        )}
        
        {/* Modal para agregar nueva unidad */}
        {isAdmin && (
          <ModalGeneric 
            title="Crear Unidad" 
            isVisible={openAddModal} 
            setIsVisible={setOpenAddModal} 
            children={<SublevelForm />}
          />
        )}
        
        {/* Botón para agregar nueva unidad */}
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
              + Agregar Unidad
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
          data={user && user.role === 'admin' ? subLevels : subLevels.filter((sublevel) => sublevel.id === user?.subLevel)}
        />
      </div>
    </>
  )
}
