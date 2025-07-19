import {
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaIdCard,
  FaDollarSign,
  FaGraduationCap,
  FaFileContract,
} from "react-icons/fa";
import { progressSheetInterface } from "../../../interface/progresssheet.interface";
import { useAuthStore } from "../../../stores";

interface ContractInfoProps {
  progressSheet: progressSheetInterface;
}

export const ContractInfo = ({ progressSheet }: ContractInfoProps) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <FaFileContract className="text-white text-2xl" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Información del Contrato
            </h2>
            <p className="text-blue-100 text-sm">
              Contrato #{progressSheet.contractNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <PersonalInfo progressSheet={progressSheet} />

          {/* Información Laboral */}
          <WorkInfo progressSheet={progressSheet} />

          {/* Información Financiera */}
          {isAdmin && <FinancialInfo progressSheet={progressSheet} />}
        </div>

        {/* Fechas del Contrato */}
        <ContractDates progressSheet={progressSheet} />

        {/* Observaciones */}
        {progressSheet.observation && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Observaciones
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{progressSheet.observation}</p>
            </div>
          </div>
        )}
        {isAdmin && progressSheet.adminObservation && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Observaciones
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{progressSheet.adminObservation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PersonalInfo = ({
  progressSheet,
}: {
  progressSheet: progressSheetInterface;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <FaUser className="text-blue-600" />
      Información Personal
    </h3>
    <div className="space-y-3">
      <InfoItem
        icon={<FaIdCard className="text-gray-400 w-4 h-4" />}
        label="Nombre Preferido"
        value={progressSheet.myPreferredName || "N/A"}
      />
      <InfoItem
        icon={<FaIdCard className="text-gray-400 w-4 h-4" />}
        label="CI Preferido"
        value={progressSheet.preferredCI || "N/A"}
      />
      <InfoItem
        icon={<FaEnvelope className="text-gray-400 w-4 h-4" />}
        label="Email"
        value={progressSheet.preferredEmail || "N/A"}
      />
      <InfoItem
        icon={<FaPhone className="text-gray-400 w-4 h-4" />}
        label="Teléfono Convencional"
        value={progressSheet.conventionalPhone || "N/A"}
      />
      <InfoItem
        icon={<FaPhone className="text-gray-400 w-4 h-4" />}
        label="Teléfono Familiar"
        value={progressSheet.familiarPhone || "N/A"}
      />
      <InfoItem
        icon={<FaPhone className="text-gray-400 w-4 h-4" />}
        label="Otros Contactos"
        value={progressSheet.otherContacts || "N/A"}
      />
    </div>
  </div>
);

const WorkInfo = ({
  progressSheet,
}: {
  progressSheet: progressSheetInterface;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <FaBriefcase className="text-blue-600" />
      Información Laboral
    </h3>
    <div className="space-y-3">
      <InfoItem
        icon={<FaBuilding className="text-gray-400 w-4 h-4" />}
        label="Empresa"
        value={progressSheet.enterpriseName || "N/A"}
      />
      <InfoItem
        icon={<FaBriefcase className="text-gray-400 w-4 h-4" />}
        label="Trabajo"
        value={progressSheet.work || "N/A"}
      />
      <InfoItem
        icon={<FaGraduationCap className="text-gray-400 w-4 h-4" />}
        label="Programa"
        value={progressSheet.program || "N/A"}
      />
      <InfoItem
        icon={<FaBuilding className="text-gray-400 w-4 h-4" />}
        label="Sede"
        value={progressSheet.headquarters || "N/A"}
      />
    </div>
  </div>
);

const FinancialInfo = ({
  progressSheet,
}: {
  progressSheet: progressSheetInterface;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <FaDollarSign className="text-blue-600" />
      Información Financiera
    </h3>
    <div className="space-y-3">
      <FinancialItem
        color="green"
        label="Total Pagado"
        value={progressSheet.totalPaid || 0}
      />
      <FinancialItem
        color="red"
        label="Total Pendiente"
        value={progressSheet.totalDue || 0}
      />
      <FinancialItem
        color="blue"
        label="Total General"
        value={progressSheet.totalFee || 0}
      />
      <FinancialItem
        color="purple"
        label="Total Descuento"
        value={progressSheet.totalDiscount || 0}
      />
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        <div>
          <p className="text-sm text-gray-600">Cantidad de Cuotas</p>
          <p className="font-medium text-orange-600">
            {progressSheet.quotesQty || 0}
          </p>
        </div>
      </div>
      <FinancialItem
        color="indigo"
        label="Valor de Cuota"
        value={progressSheet.quoteValue || 0}
      />
    </div>
  </div>
);

const ContractDates = ({
  progressSheet,
}: {
  progressSheet: progressSheetInterface;
}) => (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
      <FaCalendarAlt className="text-blue-600" />
      Fechas del Contrato
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <DateCard
        color="blue"
        label="Fecha de Inscripción"
        date={progressSheet.inscriptionDate}
      />
      <DateCard
        color="green"
        label="Fecha de Contrato"
        date={progressSheet.contractDate}
      />
      <DateCard
        color="orange"
        label="Fecha de Expiración"
        date={progressSheet.expirationDate}
      />
      <DateCard
        color="red"
        label="Fecha de Vencimiento"
        date={progressSheet.dueDate}
      />
    </div>
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const FinancialItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 bg-${color}-500 rounded-full`}></div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-medium text-${color}-600`}>${value}</p>
    </div>
  </div>
);

const DateCard = ({
  color,
  label,
  date,
}: {
  color: string;
  label: string;
  date?: string;
}) => (
  <div className={`bg-${color}-50 rounded-lg p-4`}>
    <p className={`text-sm text-${color}-600 font-medium`}>{label}</p>
    <p className={`text-lg font-bold text-${color}-800`}>
      {date ? new Date(date).toLocaleDateString() : "N/A"}
    </p>
  </div>
);
