import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useAuthStore, useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddFeeForm } from "../../components/shared/forms/AddFeeForm";
import PDFPreview from "../../components/shared/pdf/PDFPreview";
import { MdPictureAsPdf } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import Swal from "sweetalert2";
import { exportFeesToExcel, exportPaymentSummary } from "../../helpers/excel.helper";

export const FeesPage = () => {
  const getAndSetFees = useFeesStore((state) => state.getAndSetFees);
  const updateFee = useFeesStore((state) => state.updateFee);
  const fees = useFeesStore((state) => state.fees);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const isTeacher = user && user.role === "teacher";
  const getUserById = useUserStore((state) => state.getUserById);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<fee | null>(null); // Estado para la fila seleccionada
  const [showPreview, setShowPreview] = useState(false); // Estado para vista previa PDF
  const [showApprovalModal, setShowApprovalModal] = useState(false); // Estado para modal de aprobación
  const [selectedFeeForApproval, setSelectedFeeForApproval] = useState<fee | null>(null); // Fee para aprobación

  const handleGeneratePDF = useCallback((row: fee) => {
    setSelectedRow(row); // Guardar la fila seleccionada
    setShowPreview(true); // Mostrar la vista previa
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedRow(null); // Limpiar la fila seleccionada
    setShowPreview(false); // Ocultar la vista previa
  }, []);

  const handleApprovalModal = useCallback((row: fee) => {
    setSelectedFeeForApproval(row);
    setShowApprovalModal(true);
  }, []);

  const handleCloseApprovalModal = useCallback(() => {
    setSelectedFeeForApproval(null);
    setShowApprovalModal(false);
  }, []);

  const handleApproveFee = useCallback(async (approve: boolean) => {
    if (!selectedFeeForApproval) return;

    try {
      const updatedFee = {
        ...selectedFeeForApproval,
        isSigned: approve,
        updatedAt: Date.now()
      };

      await updateFee(updatedFee);
      
      Swal.fire({
        title: approve ? "¡Pago Aprobado!" : "¡Pago Rechazado!",
        text: approve ? "El pago ha sido aprobado exitosamente" : "El pago ha sido rechazado",
        icon: approve ? "success" : "warning",
        confirmButtonText: "Continuar"
      });

      // Recargar datos
      await getAndSetFees();
      handleCloseApprovalModal();
    } catch (error) {
      console.error("Error updating fee:", error);
      Swal.fire("Error", "Ocurrió un error al actualizar el pago", "error");
    }
  }, [selectedFeeForApproval, updateFee, getAndSetFees, handleCloseApprovalModal]);

  const handleExportToExcel = useCallback(async () => {
    try {
      const dataToExport = isAdmin ? fees : fees.filter(f => f.studentUid === user?.uid);
      const success = await exportFeesToExcel(dataToExport);
      
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
  }, [fees, isAdmin, user?.uid]);

  const handleExportSummary = useCallback(async () => {
    try {
      const dataToExport = isAdmin ? fees : fees.filter(f => f.studentUid === user?.uid);
      const success = await exportPaymentSummary(dataToExport);
      
      if (success) {
        Swal.fire({
          title: "¡Éxito!",
          text: "El resumen de pagos ha sido descargado exitosamente",
          icon: "success",
          confirmButtonText: "Continuar"
        });
      } else {
        Swal.fire("Error", "No se pudo exportar el resumen", "error");
      }
    } catch (error) {
      console.error("Error exporting summary:", error);
      Swal.fire("Error", "Ocurrió un error al exportar el resumen", "error");
    }
  }, [fees, isAdmin, user?.uid]);

  const columns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorKey: "code",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Nro.</span>,
      },
      {
        accessorKey: "docNumber",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() ? info.getValue() as string :'Efectivo'}</p>,
        header: () => <span>Comprobante</span>,
      },
      {
        accessorFn: (row) => row.place,
        id: "place",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Lugar</span>,
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Fecha</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => <p className="text-start text-xs">{info.getValue() as string}</p>,
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.cc,
        id: "cc",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>CI Estudiante</span>,
      },
      {
        accessorFn: (row) => row.paymentMethod,
        id: "paymentMethod",
        cell: (info) => (
            <span className="text-start text-xs">
              {info.getValue() === "cash"
                ? "💵 Cash"
                : ((info.getValue() === "transference" || "deposit") as string)
                ? "📄 Trasnference / Deposit"
                : "💳 Credit/Debit Card"}
            </span>
        ),
        enableColumnFilter: false,
        header: () => <span>Forma de pago</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => <p className="text-start text-nowrap text-xs">{"$"+info.getValue() as string}</p>,
        header: () => <span>Valor</span>,
      },
      {
        accessorFn: (row) => row.imageUrl,
        id: "imageUrl",
        cell: (data) => (
          <>
          {
            data.getValue()?<img
            src={data.getValue() as string}
            alt="No disponible"
            className="w-20 h-20 rounded-full object-cover"
          />:<p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>
          }
          </>
        ),
        enableColumnFilter: false,
        header: () => <span>Evidencia</span>,
      },
      {
        accessorFn: (row) => row.isSigned,
        id: "isSigned",
        cell: (info) => (
          <span className={`text-xs px-2 py-1 rounded-full ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {info.getValue() ? '✓ Aprobado' : '⏳ Pendiente'}
          </span>
        ),
        header: () => <span>Estado</span>,
      },
      {
        id: "actions",
        header: () => <span>Acciones</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => handleGeneratePDF(row.original)}
              title="Imprimir recibo"
            >
              <MdPictureAsPdf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            {isAdmin && (
              <button
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
                onClick={() => handleApprovalModal(row.original)}
                title="Aprobar/Rechazar pago"
              >
                <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Aprobar</span>
              </button>
            )}
          </div>
        ),
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    [handleGeneratePDF, isAdmin, handleApprovalModal]
  );
  const studentColumns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Fecha</span>,
      },
      {
        accessorKey: "code",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Nro.</span>,
      },
      {
        accessorKey: "docNumber",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() ? info.getValue() as string :'Efectivo'}</p>,
        header: () => <span>Comprobante</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => <p className="text-start text-xs">{info.getValue() as string}</p>,
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.paymentMethod,
        id: "paymentMethod",
        cell: (info) => (
            <span className="text-start text-xs">
              {info.getValue() === "cash"
                ? "💵 Cash"
                : ((info.getValue() === "transference" || "deposit") as string)
                ? "📄 Trasnference / Deposit"
                : "💳 Credit/Debit Card"}
            </span>
        ),
        enableColumnFilter: false,
        header: () => <span>Forma de pago</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => <p className="text-start text-nowrap text-xs">{"$"+info.getValue() as string}</p>,
        header: () => <span>Valor</span>,
      },
      {
        accessorFn: (row) => row.imageUrl,
        id: "imageUrl",
        cell: (data) => (
          <>
          {
            data.getValue()?<img
            src={data.getValue() as string}
            alt="No disponible"
            className="w-20 h-20 rounded-full object-cover"
          />:<p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>
          }
          </>
        ),
        enableColumnFilter: false,
        header: () => <span>Evidencia</span>,
      },
      {
        accessorFn: (row) => row.isSigned,
        id: "isSigned",
        cell: (info) => (
          <span className={`text-xs px-2 py-1 rounded-full ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {info.getValue() ? '✓ Aprobado' : '⏳ Pendiente'}
          </span>
        ),
        header: () => <span>Estado</span>,
      },
      {
        id: "actions",
        header: () => <span>Acciones</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => handleGeneratePDF(row.original)}
              title="Imprimir recibo"
            >
              <MdPictureAsPdf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        ),
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    [handleGeneratePDF]
  );
  useEffect(() => {
    getAndSetFees();
  }, [getAndSetFees]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          {isAdmin ? 'Pagos recibidos' : 'Mis pagos'}
        </h1>
        
        {/* Modal para registrar pago */}
        <ModalGeneric
          key={"frm"}
          isVisible={showModal}
          setIsVisible={setShowModal}
          title={"Registro de pago"}
          children={<AddFeeForm />}
        />
        
        {/* Botón para registrar pago */}
        {user && !isTeacher && (
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleExportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                <MdFileDownload className="w-5 h-5" />
                Exportar Excel
              </button>
              <button 
                onClick={handleExportSummary}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                <MdFileDownload className="w-5 h-5" />
                Resumen Excel
              </button>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              + Registrar Pago 💸
            </button>
          </div>
        )}

        {/* Solo botones de exportación para teachers */}
        {user && isTeacher && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button 
              onClick={handleExportToExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              <MdFileDownload className="w-5 h-5" />
              Exportar Excel
            </button>
            <button 
              onClick={handleExportSummary}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              <MdFileDownload className="w-5 h-5" />
              Resumen Excel
            </button>
          </div>
        )}
        
        {/* Tabla con TableGeneric */}
        <TableGeneric
          columns={isAdmin ? columns : studentColumns}
          data={isAdmin ? fees : fees.filter(f => f.studentUid === user?.uid)}
        />
        
        {/* Modal para vista previa PDF */}
        {showPreview && selectedRow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Vista Previa - Recibo de Pago</h2>
                <button
                  onClick={handleClosePreview}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4">
                <PDFPreview row={selectedRow} studentName={getUserById(selectedRow!.studentUid!)!.name}/>
              </div>
            </div>
          </div>
        )}

        {/* Modal para aprobación de pagos */}
        {showApprovalModal && selectedFeeForApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Aprobación de Pago</h2>
                <button
                  onClick={handleCloseApprovalModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del pago */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Información del Pago</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Código:</span> {selectedFeeForApproval.code}</p>
                        <p><span className="font-medium">Monto:</span> ${selectedFeeForApproval.qty}</p>
                        <p><span className="font-medium">Fecha:</span> {new Date(selectedFeeForApproval.createdAt).toLocaleDateString()}</p>
                        <p><span className="font-medium">Motivo:</span> {selectedFeeForApproval.reason}</p>
                        <p><span className="font-medium">Lugar:</span> {selectedFeeForApproval.place}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Método de Pago</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Método:</span> {
                          selectedFeeForApproval.paymentMethod === 'cash' ? 'Efectivo' :
                          selectedFeeForApproval.paymentMethod === 'transference' ? 'Transferencia' :
                          selectedFeeForApproval.paymentMethod === 'deposit' ? 'Depósito' :
                          selectedFeeForApproval.paymentMethod === 'tc' ? 'Tarjeta de Crédito' : 'Voucher TC'
                        }</p>
                        {selectedFeeForApproval.docNumber && (
                          <p><span className="font-medium">Nro. Comprobante:</span> {selectedFeeForApproval.docNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Estudiante</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nombre:</span> {getUserById(selectedFeeForApproval.studentUid!)?.name}</p>
                        <p><span className="font-medium">CI:</span> {selectedFeeForApproval.cc}</p>
                        <p><span className="font-medium">Cliente:</span> {selectedFeeForApproval.customerName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Imagen del comprobante */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Comprobante</h3>
                      {selectedFeeForApproval.imageUrl ? (
                        <div className="text-center">
                          <img 
                            src={selectedFeeForApproval.imageUrl} 
                            alt="Comprobante de pago" 
                            className="w-full max-w-md mx-auto rounded-lg shadow-md border"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No hay imagen de comprobante disponible</p>
                      )}
                    </div>

                    {/* Estado actual */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Estado Actual</h3>
                      <div className="text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          selectedFeeForApproval.isSigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedFeeForApproval.isSigned ? '✓ Aprobado' : '⏳ Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApproveFee(true)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  >
                    <FaCheck className="w-5 h-5" />
                    Aprobar Pago
                  </button>
                  <button
                    onClick={() => handleApproveFee(false)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  >
                    <FaTimes className="w-5 h-5" />
                    Rechazar Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
