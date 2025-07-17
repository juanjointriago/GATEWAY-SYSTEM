import { useParams } from "react-router-dom";
import { useAuthStore, useUserStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddProgressClass } from "../../components/shared/forms/AddProgressClass";
import { NoGradesMessage } from "./NoGradesMessage";
import { 
  ContractInfo, 
  ProgressClassesTable, 
  EmptyProgressSheet, 
  ProgressSheetHeader 
} from "../../components/shared/progress-sheet";
import { useProgressSheet } from "../../hooks/useProgressSheet";
import { useProgressClassesColumns } from "../../hooks/useProgressClassesColumns.tsx";

export const ProgressSheetPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const getUserById = useUserStore((state) => state.getUserById);
  const getEventById = useEventStore((state) => state.getEventById);
  const user = useAuthStore((state) => state.user);
  const isTeacher = user && user.role === "teacher";
  
  const student = getUserById(uid!);
  const columns = useProgressClassesColumns(getEventById);
  
  const {
    myProgressSheet,
    showModal,
    setShowModal,
    currentProgressSheet,
    handleAddProgressSheet,
  } = useProgressSheet({
    uid: uid!,
    studentName: student?.name,
    studentEmail: student?.email,
    studentPhone: student?.phone,
  });

  const hasProgressSheet = myProgressSheet.length > 0;
  const hasProgressClasses = hasProgressSheet && 
    myProgressSheet[0].progressClasses && 
    myProgressSheet[0].progressClasses.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProgressSheetHeader 
        studentName={student?.name}
        isTeacher={isTeacher}
        onAddProgressSheet={handleAddProgressSheet}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {hasProgressSheet ? (
          <>
            {/* Información del Contrato - Siempre visible cuando existe progressSheet */}
            <ContractInfo progressSheet={myProgressSheet[0]} />

            {/* Progress Classes Table o Mensaje de No Grades */}
            {hasProgressClasses ? (
              <ProgressClassesTable 
                progressClasses={myProgressSheet[0].progressClasses}
                columns={columns}
              />
            ) : (
              <NoGradesMessage 
                message="Puedes solicitar a tu docente que califique tus asistencias para acceder a tu progress sheet completo." 
              />
            )}
          </>
        ) : (
          <EmptyProgressSheet 
            onCreateProgressSheet={handleAddProgressSheet}
            showButton={!isTeacher}
          />
        )}
      </div>

      {/* Modal para agregar Progress Class */}
      {currentProgressSheet && student && (
        <ModalGeneric
          key={"frm"}
          isVisible={showModal}
          setIsVisible={setShowModal}
          title={"Add Progress-Sheet"}
          children={<AddProgressClass progressSheet={currentProgressSheet} studentId={student?.uid} />}
        />
      )}
    </div>
  );
};