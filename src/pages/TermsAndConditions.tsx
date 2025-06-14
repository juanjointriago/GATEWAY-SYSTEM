import { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface TermsAndConditionsProps {
  onClose?: () => void;
  isModal?: boolean;
}

const TermsAndConditions = ({ onClose, isModal = false }: TermsAndConditionsProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    // Aquí podrías guardar en localStorage o en una API que el usuario aceptó los términos
    if (onClose) setTimeout(onClose, 500);
  };

  return (
    <div className={`
      ${isModal 
        ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' 
        : 'w-full flex justify-center items-start h-full py-4'}
    `}>
      <div 
        className={`
          bg-white rounded-lg shadow-xl overflow-hidden flex flex-col
          ${isModal 
            ? 'w-full max-w-4xl max-h-[90vh]' 
            : 'w-full max-w-4xl h-[85vh]'}
        `}
      >
        {/* Encabezado con botón de cierre */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Políticas de Uso
          </h1>
          {isModal && (
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <IoMdClose size={24} />
            </button>
          )}
        </div>

        {/* Contenido con scroll - Ajustado para asegurar visibilidad completa */}
        <div className="overflow-y-auto p-5 md:p-6 flex-grow">
          <div className="max-w-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                1. Aceptación de las Políticas de Uso
              </h2>
              <p className="text-gray-700">
                Al utilizar nuestra aplicación para la reservación de clases de inglés, usted acepta cumplir con las presentes Políticas de Uso y nuestra Política de Privacidad. Si no está de acuerdo con alguna de las condiciones, le recomendamos no utilizar la aplicación.
              </p>
            </div>

            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                2. Uso Permitido
              </h2>
              <p className="text-gray-700">
                La aplicación está destinada exclusivamente para fines educativos e informativos relacionados con la gestión y reservación de clases de inglés. El usuario se compromete a utilizar la plataforma de manera responsable, respetando a otros usuarios y al personal de Gateway Corporation.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                3. Registro y Veracidad de la Información
              </h2>
              <p className="text-gray-700">
                Para acceder a los servicios, el usuario debe proporcionar información verídica, actual y completa, incluyendo nombre completo, correo electrónico, número de teléfono, información de pago y nivel de inglés. El usuario es responsable de mantener actualizada su información.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                4. Responsabilidades del Usuario
              </h2>
              <p className="text-gray-700 mb-2">
                El usuario se compromete a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>No utilizar la aplicación para fines ilícitos, fraudulentos o no autorizados.</li>
                <li>No intentar acceder a cuentas de otros usuarios ni a sistemas restringidos de la aplicación.</li>
                <li>No interferir con el funcionamiento de la plataforma ni realizar acciones que puedan afectar su seguridad o integridad.</li>
              </ul>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                5. Reservaciones y Pagos
              </h2>
              <p className="text-gray-700">
                Las reservaciones de clases están sujetas a disponibilidad. El usuario debe seguir el proceso indicado en la aplicación para reservar y realizar los pagos correspondientes. Gateway Corporation se reserva el derecho de modificar horarios o cancelar clases por causas justificadas, notificando oportunamente al usuario.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                6. Cancelaciones y Reembolsos
              </h2>
              <p className="text-gray-700">
                Las políticas de cancelación y reembolso serán comunicadas claramente en la aplicación. El usuario debe revisar y aceptar estas condiciones antes de realizar cualquier pago.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                7. Propiedad Intelectual
              </h2>
              <p className="text-gray-700">
                Todos los contenidos, materiales educativos, textos, imágenes, logotipos y software de la aplicación son propiedad de Gateway Corporation o de sus licenciantes. Queda prohibida su reproducción, distribución o uso no autorizado.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                8. Protección de Datos
              </h2>
              <p className="text-gray-700">
                La información personal proporcionada será tratada conforme a nuestra Política de Privacidad, implementando medidas de seguridad para proteger los datos de los usuarios.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                9. Modificaciones de las Políticas
              </h2>
              <p className="text-gray-700">
                Gateway Corporation se reserva el derecho de modificar estas Políticas de Uso en cualquier momento. Los cambios serán notificados a través de la aplicación o por correo electrónico. El uso continuado de la plataforma implica la aceptación de las modificaciones.
              </p>
            </div>
            
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 text-indigo-700">
                10. Contacto
              </h2>
              <p className="text-gray-700 mb-2">
                Para consultas, sugerencias o reclamos relacionados con las Políticas de Uso, puede contactarnos en:
              </p>
              <ul className="list-none space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <li><span className="font-medium text-gray-900">Correo electrónico:</span> <a href="mailto:gatewaycorporation@hotmail.com" className="text-blue-600 hover:underline">gatewaycorporation@hotmail.com</a></li>
                <li><span className="font-medium text-gray-900">Teléfonos:</span> <a href="tel:+593987548369" className="text-blue-600 hover:underline">+593 (098) 754-8369</a> / <a href="tel:+593992650605" className="text-blue-600 hover:underline">+593 (099) 265-0605</a></li>
                <li><span className="font-medium text-gray-900">Desarrollador:</span> Purple-Widget</li>
                <li><span className="font-medium text-gray-900">Email desarrollador:</span> <a href="mailto:juan.intriago@purple-widget.com" className="text-blue-600 hover:underline">juan.intriago@purple-widget.com</a></li>
              </ul>
            </div>
            
            <div className="mt-10 mb-4 text-center">
              <p className="text-sm text-gray-500 italic">
                Última actualización:
              </p>
               <p>&copy; {new Date().getFullYear()} Gateway Corporation. Todos los derechos reservados.</p>
            <p className="mt-2">Desarrollado por <a href="https://purple-widget.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">Purple-Widget</a></p>
              <div className="mt-2">
                <img 
                  src="/assets/logo.png" 
                  alt="Gateway Corporation Logo" 
                  className="h-12 mx-auto opacity-70"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pie con botones */}
        {isModal && (
          <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-3 bg-gray-50">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Cerrar
            </button>
            <button 
              onClick={handleAccept}
              className={`
                px-6 py-2 rounded-md w-full sm:w-auto transition-all
                ${accepted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              `}
              disabled={accepted}
            >
              {accepted ? '✓ Términos Aceptados' : 'Acepto los Términos'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal de términos y condiciones reutilizable
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;
  
  return <TermsAndConditions onClose={onClose} isModal={true} />;
};

export default TermsAndConditions;

