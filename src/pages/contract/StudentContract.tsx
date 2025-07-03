import { useUserStore } from "../../stores";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";

interface Props {
    studentID: string;
}
export const StudentContract = ({ studentID }: Props) => {
  const getStudentById = useUserStore((state) => state.getUserById);
  const getProgressSheetByStudentId = useProgressSheetStore((state) => state.getProgressSheetByStudentId);

  const student = getStudentById(studentID);
  if (!student) {
    return <div>No student found with ID: {studentID}</div>;
  }

  const progressSheet = getProgressSheetByStudentId(studentID);
  if (!progressSheet) {
    return <div>No progress sheet found for student ID: {studentID}</div>;
  }

  return (
    <div>
      {
        
      }
    </div>
  )
}
