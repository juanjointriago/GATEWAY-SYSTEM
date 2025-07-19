import { FC, ReactNode, useState } from 'react';
import { useProgressSheetStore } from '../../../stores/progress-sheet/progresssheet.store';
import { progressSheetInterface } from '../../../interface/progresssheet.interface';
import CustomModal from '../../CustomModal';

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

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'warn' | 'info' | 'danger' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ open: false, title: '', message: '', type: 'info' });

  const validateUserActivation = async () => {
    try {
      // Obtener el progressSheet del usuario
      const progressSheet = getProgressSheetByStudentId(userId);

      if (!progressSheet) {
        setModal({
          open: true,
          title: '⚠️ Contrato No Creado',
          message: 'No se ha creado un contrato para este estudiante.\n\nDebe crear y llenar el contrato del estudiante antes de activarlo.',
          type: 'warn',
          confirmText: 'Entendido',
          onConfirm: () => setModal((m) => ({ ...m, open: false })),
        });
        return;
      }

      // Validar si los totales financieros están en cero
      const hasFinancialData = checkFinancialData(progressSheet);

      if (!hasFinancialData) {
        setModal({
          open: true,
          title: '📋 Actualizar Información del Contrato',
          message:
            'Los valores financieros del contrato están en cero.\n\nDebe actualizar los siguientes campos en el contrato:\n- Total Adeudado\n- Total Pagado (si aplica)\n- Cantidad de Cuotas\n- Otros campos financieros',
          type: 'info',
          confirmText: 'Actualizar Contrato',
          cancelText: 'Cancelar',
          onConfirm: () => setModal((m) => ({ ...m, open: false })),
          onCancel: () => setModal((m) => ({ ...m, open: false })),
        });
        return;
      }

      // Si pasa todas las validaciones, proceder con la activación
      onValidationSuccess();
    } catch (error) {
      console.error('Error en validación de activación:', error);
      setModal({
        open: true,
        title: 'Error',
        message: 'Ocurrió un error al validar la información del usuario',
        type: 'danger',
        confirmText: 'Aceptar',
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
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
    <>
      <div
        onClick={validateUserActivation}
        className="w-full"
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
      <CustomModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm || (() => setModal((m) => ({ ...m, open: false })))}
        onCancel={modal.cancelText ? modal.onCancel : undefined}
      />
    </>
  );
};
