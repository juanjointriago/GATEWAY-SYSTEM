import { useEffect, useMemo, useState, useCallback } from "react";
import { unit } from "../../interface"
import { useAuthStore, useUnitStore } from "../../stores";
import { FormUnit } from "../../components/shared/forms/FormUnit";
import { UrlIframe } from "../../components/shared/pdf/UrlIframe";
import { NavLink } from "react-router-dom";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoPencil, IoTrash } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUnitForm } from "../../components/shared/forms/EditUnitForm";
import CustomModal from "../../components/CustomModal";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { ColumnDef } from "@tanstack/react-table";
import { exportUnitsToExcel } from "../../helpers/excel.helper";



export const UnitsPage = () => {
  const updateUnit = useUnitStore(state => state.updateUnit);
  const deleteUnit = useUnitStore(state => state.deleteUnit);
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const getAllUnits = useUnitStore(state => state.getAndSetUnits);
  const books = useUnitStore(state => state.units);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState<unit>();

  // Estados para CustomModal
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    onCancel: undefined as (() => void) | undefined,
  });

  const handleExportToExcel = useCallback(async () => {
    try {
      const success = await exportUnitsToExcel(books);
      if (success) {
        setModal({
          isOpen: true,
          title: '¡Éxito!',
          message: 'El archivo Excel ha sido descargado exitosamente',
          type: 'success',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
          onCancel: () => setModal(m => ({ ...m, isOpen: false })),
        });
      } else {
        setModal({
          isOpen: true,
          title: 'Error',
          message: 'No se pudo exportar el archivo Excel',
          type: 'danger',
          onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
          onCancel: () => setModal(m => ({ ...m, isOpen: false })),
        });
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Ocurrió un error al exportar el archivo',
        type: 'danger',
        onConfirm: () => setModal(m => ({ ...m, isOpen: false })),
        onCancel: () => setModal(m => ({ ...m, isOpen: false })),
      });
    }
  }, [books]);


  useEffect(() => {
    getAllUnits();
  }, [getAllUnits]);
  
  console.debug('UNIDADES', books);

  const columns = useMemo<ColumnDef<unit>[]>(() => [
    {
      accessorKey: 'orderNumber',
      header: 'Nro.',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.getValue('orderNumber')}
        </span>
      ),
    },
    {
      accessorKey: 'sublevel',
      header: 'Unidad',
      cell: ({ row }) => (
        <div className="flex items-center">
          <SubLevelById subLevelId={row.getValue('sublevel')} />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium text-gray-900 truncate">
            {row.getValue('name')}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'author',
      header: 'Autor',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.getValue('author') || 'Sin autor'}
        </span>
      ),
    },
    {
      accessorKey: 'supportMaterial',
      header: 'Material de Apoyo',
      cell: ({ row }) => (
        <div className="w-full">
          <UrlIframe 
            title={row.getValue('name')} 
            src={row.getValue('supportMaterial')} 
            errorMsg="Error al cargar el archivo" 
          />
        </div>
      ),
    },
    {
      accessorKey: 'workSheetUrl',
      header: 'Work Sheet',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <NavLink 
            to={row.getValue('workSheetUrl')} 
            target="_blank" 
            rel="noreferrer noopener"
            className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-colors duration-200"
          >
            <span className="hidden sm:inline">🔍 WorkSheet</span>
            <span className="sm:hidden">🔍</span>
          </NavLink>
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: isAdmin ? 'Acciones' : 'Estado',
      cell: ({ row }) => {
        const unit = row.original;
        
        if (!isAdmin) {
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              unit.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {unit.isActive ? 'Disponible' : 'No disponible'}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <ToggleButton
              isActive={unit.isActive}
              action={() => {
                setModal({
                  isOpen: true,
                  title: '¿Estás seguro?',
                  message: `Estás a punto de ${unit.isActive ? 'ocultar' : 'mostrar'} este Libro`,
                  type: 'warn',
                  onConfirm: async () => {
                    setModal(m => ({ ...m, isOpen: false }));
                    await updateUnit({ ...unit, isActive: !unit.isActive });
                    window.location.reload();
                  },
                  onCancel: () => setModal(m => ({ ...m, isOpen: false })),
                });
              }}
            />
            <FabButton 
              isActive 
              tootTipText="Editar unidad" 
              action={() => { 
                setOpenModal(true); 
                setUnitToEdit(unit) 
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
                  title: '¿Estás seguro?',
                  message: 'Estás a punto de eliminar este Libro',
                  type: 'danger',
                  onConfirm: async () => {
                    setModal(m => ({ ...m, isOpen: false }));
                    await deleteUnit(unit.id!);
                  },
                  onCancel: () => setModal(m => ({ ...m, isOpen: false })),
                });
              }} 
            />
          </div>
        );
      },
    },
  ], [updateUnit, deleteUnit, isAdmin]);

  // Filtrar datos según el rol del usuario
  const filteredData = useMemo(() => {
    if (!user) return [];
    let data: unit[] = [];
    if (user.role === 'admin') {
      data = books;
    } else {
      data = user.unitsForBooks ? books.filter((unit) => user.unitsForBooks.includes(unit.sublevel)) : [];
    }
    // Ordenar por orderNumber ascendente
    return [...data].sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
  }, [user, books]);

  return (
    <>
      <CustomModal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type as 'warn' | 'info' | 'danger' | 'success'}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Libros
        </h1>
        
        {/* Modal para editar unidad */}
        {isAdmin && unitToEdit && (
          <ModalGeneric 
            title="Actualizar datos" 
            isVisible={openModal} 
            setIsVisible={setOpenModal} 
            children={<EditUnitForm unit={unitToEdit} />} 
          />
        )}
        
        {/* Modal para agregar nueva unidad */}
        {isAdmin && (
          <ModalGeneric 
            title="Crear Nueva Unidad" 
            isVisible={openAddModal} 
            setIsVisible={setOpenAddModal} 
            children={<FormUnit />}
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
              + Agregar Libro
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
          data={filteredData}
        />
      </div>
    </>
  )
}
