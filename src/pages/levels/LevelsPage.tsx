import { useMemo, useState, useCallback } from "react";
import { level } from "../../interface"
import { useAuthStore, useLevelStore } from "../../stores";
import { FormLevel } from "../../components/shared/forms";
import CustomModal from "../../components/CustomModal";
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

  // Estados para CustomModal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");
  const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});
  const [modalCancelable, setModalCancelable] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");

  const showModal = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', action?: () => Promise<void> | void, cancelable = false) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalAction(() => action || (() => setModalOpen(false)));
    setModalCancelable(cancelable);
    setModalOpen(true);
  };

  const showFeedback = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', reload = false) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackOpen(true);
    if (reload) setTimeout(() => window.location.reload(), 1200);
  };

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportLevelsToExcel(levels);
      if (success) {
        showFeedback("¡Éxito!", "El archivo Excel ha sido descargado exitosamente", "success");
      } else {
        showFeedback("Error", "No se pudo exportar el archivo Excel", "danger");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error exporting to Excel:", error);
      showFeedback("Error", error.message || "Ocurrió un error al exportar el archivo", "danger");
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
                showModal(
                  '¿Estás seguro?',
                  `Estás a punto de ${level.isActive ? 'ocultar' : 'mostrar'} esta modalidad`,
                  'warn',
                  async () => {
                    setModalOpen(false);
                    await updateLevel({ ...level, isActive: !level.isActive });
                    showFeedback('¡Actualizado!', 'El estado de la modalidad ha sido actualizado.', 'success', true);
                  },
                  true
                );
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
                showModal(
                  '¿Estás seguro?',
                  'Estás a punto de eliminar esta modalidad',
                  'danger',
                  async () => {
                    setModalOpen(false);
                    await deleteLevel(level.id!);
                    showFeedback('Eliminado', 'La modalidad ha sido eliminada.', 'success', true);
                  },
                  true
                );
              }} 
            />
          </div>
        );
      },
    },
  ], [updateLevel, deleteLevel, isAdmin]);

  return (
    <>
      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={modalAction}
        onCancel={modalCancelable ? () => setModalOpen(false) : undefined}
      />
      <CustomModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        onConfirm={() => setFeedbackOpen(false)}
      />
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
