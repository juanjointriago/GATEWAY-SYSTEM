import { FC, ReactNode } from 'react';
import { useProgressSheetStore } from '../../../stores/progress-sheet/progresssheet.store';
import { progressSheetInterface } from '../../../interface/progresssheet.interface';
import Swal from 'sweetalert2';

interface UserActivationValidatorProps {
  userId: string;
  onValidationSuccess: () => void;
  children: ReactNode;
}

export const UserActivationValidator: FC<UserActivationValidatorProps> = ({
  userId,
  onValidationSuccess,
  children
}) => {
  const getProgressSheetByStudentId = useProgressSheetStore(
    (state) => state.getProgressSheetByStudentId
  );

  const validateUserActivation = async () => {
    try {
      // Obtener el progressSheet del usuario
      const progressSheet = getProgressSheetByStudentId(userId);
      
      if (!progressSheet) {
        // No existe contrato
        await Swal.fire({
          title: '⚠️ Contrato No Creado',
          html: `
            <div class="text-left">
              <p class="mb-3">No se ha creado un contrato para este estudiante.</p>
              <p class="text-sm text-gray-600">
                <strong>Acción requerida:</strong> Debe crear y llenar el contrato del estudiante antes de activarlo.
              </p>
            </div>
          `,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#f59e0b',
          showCancelButton: false,
          allowOutsideClick: false
        });
        return;
      }

      // Validar si los totales financieros están en cero
      const hasFinancialData = checkFinancialData(progressSheet);
      
      if (!hasFinancialData) {
        await Swal.fire({
          title: '📋 Actualizar Información del Contrato',
          html: `
            <div class="text-left">
              <p class="mb-3">Los valores financieros del contrato están en cero.</p>
              <p class="text-sm text-gray-600">
                <strong>Acción requerida:</strong> Debe actualizar los siguientes campos en el contrato:
              </p>
              <ul class="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Total Adeudado</li>
                <li>Total Pagado (si aplica)</li>
                <li>Cantidad de Cuotas</li>
                <li>Otros campos financieros</li>
              </ul>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Actualizar Contrato',
          confirmButtonColor: '#3b82f6',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#6b7280'
        });
        return;
      }

      // Si pasa todas las validaciones, proceder con la activación
      onValidationSuccess();
      
    } catch (error) {
      console.error('Error en validación de activación:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al validar la información del usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const checkFinancialData = (progressSheet: progressSheetInterface): boolean => {
    const { totalFee, totalPaid, totalDue, totalDiscount, quotesQty, quoteValue } = progressSheet;
    
    // Verificar si al menos algunos campos financieros tienen valores válidos
    return Boolean(
      (totalFee && totalFee > 0) ||
      (totalPaid && totalPaid > 0) ||
      (totalDue && totalDue > 0) ||
      (totalDiscount && totalDiscount > 0) ||
      (quotesQty && quotesQty > 0) ||
      (quoteValue && quoteValue > 0)
    );
  };

  return (
    <div onClick={validateUserActivation} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};
