import { useState, useEffect } from "react";
import { useProgressSheetStore } from "../stores/progress-sheet/progresssheet.store";
import { progressSheetInterface } from "../interface/progresssheet.interface";
import { v6 as uuid } from "uuid";

interface UseProgressSheetProps {
  uid: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
}

export const useProgressSheet = ({ uid, studentName, studentEmail, studentPhone }: UseProgressSheetProps) => {
  const getAndSetProgressSheets = useProgressSheetStore((state) => state.getAndSetProgressSheets);
  const createProgressSheet = useProgressSheetStore((state) => state.createProgressSheet);
  const progressSheet = useProgressSheetStore((state) => state.progressSheets);
  
  const [showModal, setShowModal] = useState(false);
  const [currentProgressSheet, setCurrentProgressSheet] = useState<progressSheetInterface | null>(null);

  const myProgressSheet = progressSheet.filter((ps) => ps.studentId === uid);

  useEffect(() => {
    getAndSetProgressSheets();
  }, [getAndSetProgressSheets]);

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'warn' | 'info' | 'danger' | 'success';
    onConfirm?: () => void;
  }>({ open: false, title: '', message: '', type: 'info' });

  const handleAddProgressSheet = async () => {
    if (myProgressSheet.length > 0) {
      // Si ya existe un ProgressSheet, usar el existente
      setCurrentProgressSheet(myProgressSheet[0]);
      setShowModal(true);
    } else {
      // Si no existe, crear uno nuevo
      try {
        const duuid = uuid();
        const newProgressSheet: progressSheetInterface = {
          id: duuid,
          uid: duuid,
          studentId: uid,
          contractNumber: "000",
          headquarters: "",
          inscriptionDate: new Date().toISOString().split('T')[0],
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          myPreferredName: studentName || "",
          contractDate: new Date().toISOString().split('T')[0],
          work: "",
          enterpriseName: "",
          preferredCI: "",
          conventionalPhone: "",
          familiarPhone: "",
          preferredEmail: studentEmail || "",
          otherContacts: studentPhone || "",
          program: "",
          observation: "",
          totalFee: 0,
          totalPaid: 0,
          totalDue: 0,
          totalDiscount: 0,
          quotesQty: 0,
          quoteValue: 0,
          dueDate: "",
          progressClasses: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await createProgressSheet(newProgressSheet);
        setCurrentProgressSheet(newProgressSheet);
        setShowModal(true);
      } catch (error) {
        console.error("Error al crear el Progress Sheet:", error);
        setModal({
          open: true,
          title: 'Error',
          message: 'No se pudo crear el Progress Sheet',
          type: 'danger',
          onConfirm: () => setModal((m) => ({ ...m, open: false })),
        });
      }
    }
  };

  return {
    myProgressSheet,
    showModal,
    setShowModal,
    currentProgressSheet,
    handleAddProgressSheet,
    progressSheetModalProps: {
      isOpen: modal.open,
      title: modal.title,
      message: modal.message,
      type: modal.type,
      onConfirm: modal.onConfirm || (() => setModal((m) => ({ ...m, open: false }))),
    },
  };
};
