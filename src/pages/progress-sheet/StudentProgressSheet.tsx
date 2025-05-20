import { FC } from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer
  } from '@react-pdf/renderer';
import {  ProgressEntry, StudentInfo } from '../../interface/progresssheet.interface';
import Swal from 'sweetalert2';
import { useProgressSheetStore } from '../../stores/progress-sheet/progresssheet.store';
import { useUserStore } from '../../stores';
import { useEventStore } from '../../stores/events/event.store';
  
  // Definimos los estilos
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 30,
    },
    landscapePage: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 30,
      size: 'landscape',
    },
    header: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      fontWeight: 'bold',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    row: {
      flexDirection: 'row',
      marginVertical: 5,
    },
    label: {
      width: 120,
      fontWeight: 'bold',
    },
    value: {
      flex: 1,
      borderBottom: 1,
      marginLeft: 10,
    },
    table: {
      flexDirection: 'column',
      width: '100%',
      marginTop: 20,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      minHeight: 25,
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#000',
      fontSize: 8,
      flexWrap: 'wrap',
      minWidth: 60,
    },
    tableTitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10,
      fontWeight: 'bold',
    }
  });
  
  interface Props {
    studentID: string;
  }

export const StudentProgressSheet:FC<Props> = ({ studentID }) => {

  const getUserById = useUserStore( state => state.getUserById);
  const getProgressSheetByStudentId = useProgressSheetStore(state => state.getProgressSheetByStudentId);
  const student = getUserById(studentID);
  const getEventById =  useEventStore(state => state.getEventById);
  if(!student) {
    Swal.fire(" Error", "No se encontró un estudiante con ese UID", "error");
    return;
  }
  const progressClasses = getProgressSheetByStudentId(studentID);
  if( (progressClasses?.progressClasses.length === 0) || !progressClasses) {
    Swal.fire(" Error", "No se encontró un ProgressSheet con ese Estudiante", "error");
    return;
  }
  const age = new Date().getFullYear() - new Date(student.bornDate).getFullYear();
  const progressEntries :ProgressEntry[] = progressClasses.progressClasses.map((record)=>{
    const event = getEventById(record.eventInfo.value);
    if(!event) return {} as ProgressEntry;
    return {
      ...record,
      teacher:event?.teacher || "",
      date: new Date(record.createdAt || 0).toLocaleDateString(),
      hour: new Date(record.createdAt || 0).toLocaleTimeString(),
    }
  })
  const studentInfo: StudentInfo = {
    ...student,
    headline: "",
    preferredName: student.name,
    age: age.toString(),
    birthday: student.bornDate,
    occupation: 'student',
    fullName: student.name,
    gender: 'undefined',
    observation: 'none',
    otherContacts: student.phone,
    phone:  student.phone,
    idNumber: student.cc,
    regNumber: student.cc ,
    inscriptionDate: student.createdAt.toString() || "",
    expirationDate: student.createdAt.toString() || "",
    
    progressEntries: progressEntries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
  }


    const TableRow = ({ entry }: { entry: ProgressEntry }) => (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { width: 80 }]}>{entry.date}</Text>
        <Text style={[styles.tableCell, { width: 60 }]}>{entry.hour}</Text>
        <Text style={[styles.tableCell, { width: 100 }]}>{entry.book}</Text>
        <Text style={[styles.tableCell, { width: 100 }]}>{entry.progress}</Text>
        <Text style={[styles.tableCell, { width: 60 }]}>{entry.part}</Text>
        <Text style={[styles.tableCell, { width: 60 }]}>{entry.test}</Text>
        <Text style={[styles.tableCell, { width: 100 }]}>{entry.teacher}</Text>
        <Text style={[styles.tableCell, { width: 200 }]}>{entry.observation}</Text>
      </View>
    );

  return (
    <PDFViewer style={{ width: '70rem', height: '800px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>PROGRESS SHEET</Text>
          
          {/* Información Personal */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Preferred Name:</Text>
              <Text style={styles.value}>{studentInfo.preferredName}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>ID Nº:</Text>
              <Text style={styles.value}>{studentInfo.idNumber}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>REG Nº:</Text>
              <Text style={styles.value}>{studentInfo.regNumber}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Inscription Date:</Text>
              <Text style={styles.value}>{studentInfo.inscriptionDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Expiration:</Text>
              <Text style={styles.value}>{studentInfo.expirationDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{studentInfo.fullName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{studentInfo.age}</Text>
              <Text style={styles.label}>Birthday:</Text>
              <Text style={styles.value}>{studentInfo.birthday}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{studentInfo.phone}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Other Contacts:</Text>
              <Text style={styles.value}>{studentInfo.otherContacts}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Observation:</Text>
              <Text style={styles.value}>{studentInfo.observation}</Text>
            </View>
          </View>
        </Page>

        <Page size="A4" orientation="landscape" style={styles.landscapePage}>
          <Text style={styles.tableTitle}>PROGRESS TABLE</Text>
          
          {/* Tabla de Progreso */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: 80 }]}>DATE</Text>
              <Text style={[styles.tableCell, { width: 60 }]}>HOUR</Text>
              <Text style={[styles.tableCell, { width: 100 }]}>BOOK</Text>
              <Text style={[styles.tableCell, { width: 100 }]}>PROGRESS</Text>
              <Text style={[styles.tableCell, { width: 60 }]}>PART</Text>
              <Text style={[styles.tableCell, { width: 60 }]}>TEST</Text>
              <Text style={[styles.tableCell, { width: 100 }]}>TEACHER</Text>
              <Text style={[styles.tableCell, { width: 200 }]}>OBSERVATION</Text>
            </View>
            {studentInfo.progressEntries.map((entry, index) => (
              <TableRow key={index} entry={entry} />
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}
