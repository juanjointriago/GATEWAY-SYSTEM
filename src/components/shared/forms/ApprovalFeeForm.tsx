import { FC, useCallback } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { fee } from "../../../interface/fees.interface";
import { useFeesStore } from "../../../stores/fees/fess.store";
import { useUserStore } from "../../../stores";
import { useProgressSheetStore } from "../../../stores/progress-sheet/progresssheet.store";
import { sendCustomEmail, footerMail } from "../../../store/firebase/helper";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "../../../helpers/swal.helper";

interface ApprovalFeeFormProps {
  selectedFeeForApproval: fee;
  onClose: () => void;
}

export const ApprovalFeeForm: FC<ApprovalFeeFormProps> = ({ 
  selectedFeeForApproval, 
  onClose 
}) => {
  const updateFee = useFeesStore((state) => state.updateFee);
  const getAndSetFees = useFeesStore((state) => state.getAndSetFees);
  const getUserById = useUserStore((state) => state.getUserById);
  const { getProgressSheetByStudentId, updateProgressSheet } = useProgressSheetStore();

  const sendNotificationEmail = useCallback(async (approve: boolean, studentData: { email?: string } | null) => {
    if (!studentData?.email) return;

    const status = approve ? "aprobado" : "rechazado";
    const statusEmoji = approve ? "✅" : "❌";
    const statusColor = approve ? "#10B981" : "#EF4444";

    const emailData = {
      to: [studentData.email],
      message: {
        subject: `Notificación de Pago ${approve ? "Aprobado" : "Rechazado"} - Gateway English`,
        text: `Su pago ha sido ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Gateway English</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Sistema de Gestión Académica</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 15px;">${statusEmoji}</div>
                <h2 style="color: ${statusColor}; margin: 0; font-size: 24px;">
                  Pago ${approve ? "Aprobado" : "Rechazado"}
                </h2>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Detalles del Pago:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 500;">Código:</td>
                    <td style="padding: 8px 0; color: #333;">${selectedFeeForApproval.code}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 500;">Monto:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">$${selectedFeeForApproval.qty}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 500;">Fecha:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date(selectedFeeForApproval.createdAt).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 500;">Motivo:</td>
                    <td style="padding: 8px 0; color: #333;">${selectedFeeForApproval.reason}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: 500;">Método de Pago:</td>
                    <td style="padding: 8px 0; color: #333;">${
                      selectedFeeForApproval.paymentMethod === 'cash' ? 'Efectivo' :
                      selectedFeeForApproval.paymentMethod === 'transference' ? 'Transferencia' :
                      selectedFeeForApproval.paymentMethod === 'deposit' ? 'Depósito' :
                      selectedFeeForApproval.paymentMethod === 'tc' ? 'Tarjeta de Crédito' : 'Voucher TC'
                    }</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: ${approve ? '#ecfdf5' : '#fef2f2'}; border-left: 4px solid ${statusColor}; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; color: #333; font-size: 16px;">
                  ${approve ? 
                    '¡Felicidades! Su pago ha sido aprobado exitosamente. Puede continuar con sus clases normalmente.' :
                    'Su pago ha sido rechazado. Por favor, revise los detalles del pago y vuelva a intentarlo o contacte con administración para más información.'
                  }
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; margin: 0;">
                  Si tiene alguna pregunta, no dude en contactarnos.
                </p>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">
                  Equipo de Gateway English
                </p>
              </div>
            </div>
            
            ${footerMail}
          </div>
        `
      }
    };

    try {
      await sendCustomEmail(emailData);
      console.log("Email de notificación enviado exitosamente");
    } catch (error) {
      console.error("Error enviando email de notificación:", error);
    }
  }, [selectedFeeForApproval]);

  const handleApproveFee = useCallback(async (approve: boolean) => {
    try {
      const updatedFee = {
        ...selectedFeeForApproval,
        isSigned: approve,
        updatedAt: Date.now()
      };

      await updateFee(updatedFee);
      
      // Si se aprueba el pago, actualizar el progressSheet
      if (approve) {
        try {
          const progressSheet = await getProgressSheetByStudentId(selectedFeeForApproval.studentUid!);
          
          if (progressSheet) {
            const paymentAmount = Number(selectedFeeForApproval.qty);
            
            // Validar que el monto sea válido
            if (!isNaN(paymentAmount) && paymentAmount > 0) {
              const currentTotalPaid = Number(progressSheet.totalPaid || 0);
              const currentTotalDue = Number(progressSheet.totalDue || 0);
              
              const updatedProgressSheet = {
                ...progressSheet,
                totalPaid: currentTotalPaid + paymentAmount,
                totalDue: Math.max(0, currentTotalDue - paymentAmount),
                updatedAt: Date.now(),
              };
              
              await updateProgressSheet(updatedProgressSheet);
              console.log("ProgressSheet actualizado exitosamente tras aprobación del pago");
            }
          }
        } catch (progressError) {
          console.error("Error actualizando progressSheet:", progressError);
          // No interrumpir el flujo principal si hay error con progressSheet
        }
      }
      
      // Obtener datos del estudiante para enviar el email
      const studentData = getUserById(selectedFeeForApproval.studentUid!) || null;
      
      // Enviar email de notificación
      await sendNotificationEmail(approve, studentData);
      
      const successText = approve 
        ? "El pago ha sido aprobado exitosamente, se ha actualizado el contrato y se ha enviado una notificación al estudiante"
        : "El pago ha sido rechazado y se ha enviado una notificación al estudiante";
      
      if (approve) {
        showSuccessAlert("¡Pago Aprobado!", successText, "Continuar");
      } else {
        showWarningAlert("¡Pago Rechazado!", successText, "Continuar");
      }

      // Recargar datos
      await getAndSetFees();
      onClose();
    } catch (error) {
      console.error("Error updating fee:", error);
      showErrorAlert("Error", "Ocurrió un error al actualizar el pago");
    }
  }, [selectedFeeForApproval, updateFee, getAndSetFees, getUserById, sendNotificationEmail, onClose, getProgressSheetByStudentId, updateProgressSheet]);

  return (
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

      {/* Botones de acción */}
      <div className="col-span-1 md:col-span-2">
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
  );
};
