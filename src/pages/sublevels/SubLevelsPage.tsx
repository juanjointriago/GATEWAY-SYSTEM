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
import CustomModal, { CustomModalProps } from "../../components/CustomModal"
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
  // Estado para modales de feedback y confirmación
  const [modal, setModal] = useState<CustomModalProps>({ 
    isOpen: false, type: 'info', title: '', message: '', onConfirm: () => {}, onCancel: () => {} });

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportSublevelsToExcel(subLevels);
      if (success) {
        setModal({
          isOpen: true,
          type: 'success',
          title: '¡Éxito!',
          message: 'El archivo Excel ha sido descargado exitosamente',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
          onCancel: () => setModal(m => ({ ...m, isOpen: false })),
        });
      } else {
        setModal({
          isOpen: true,
          type: 'warn',
          title: 'Error',
          message: 'No se pudo exportar el archivo Excel',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
          onCancel: () => setModal(m => ({ ...m, isOpen: false })),
        });
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setModal({
        isOpen: true,
        type: 'warn',
        title: 'Error',
        message: 'Ocurrió un error al exportar el archivo',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
        onCancel: () => setModal(m => ({ ...m, isOpen: false })),
      });
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
                setModal({
                  isOpen: true,
                  type: 'warn',
                  title: '¿Estás seguro?',
                  message: `Estas a punto de ${subLevel.isActive ? 'ocultar' : 'mostrar'} esta Unidad`,
                  onConfirm: async () => {
                    setModal(m => ({ ...m, open: false }));
                    await updateSublevel({ ...subLevel, isActive: !subLevel.isActive });
                    window.location.reload();
                  },
                  onCancel: () => setModal(m => ({ ...m, open: false })),
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
                setModal({
                  isOpen: true,
                  type: 'warn',
                  title: '¿Estás seguro?',
                  message: 'Estas a punto de eliminar esta Unidad (Sub-Nivel)',
                  onConfirm: async () => {
                    setModal(m => ({ ...m, open: false }));
                    await deleteSubLevel(subLevel.id!);
                  },
                  onCancel: () => setModal(m => ({ ...m, isOpen: false })),
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
      {/* Modal de feedback y confirmación */}
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  )
}
