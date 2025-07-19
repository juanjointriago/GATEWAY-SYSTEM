import { useState, useEffect } from "react";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import CustomModal from "../../components/CustomModal";

export const DeleteUserData = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Verificar si el formulario ya se ha usado
  useEffect(() => {
    const formUsed = localStorage.getItem("deletionFormUsed");
    if (formUsed === "true") {
      setIsFormDisabled(true);
      setSuccess(true); // Mostrar mensaje de éxito directamente si ya se usó
    }
  }, []);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Por favor, ingrese un correo electrónico válido");
      return;
    }

    // Confirmación con CustomModal
    setModal({
      open: true,
      title: '¿Estás seguro?',
      message: 'Esta acción marcará tu cuenta para eliminación y no podrá revertirse.',
      type: 'warn',
      confirmText: 'Sí, eliminar mis datos',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setModal((m) => ({ ...m, open: false }));
        setIsLoading(true);
        setError("");
        const auth = getAuth();
        try {
          // Iniciar sesión anónima
          await signInAnonymously(auth);
          const db = getFirestore();
          const usersRef = collection(db, "users");
          // Buscar el usuario por email
          const q = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            setError("No se encontró ninguna cuenta con este correo electrónico");
            setIsLoading(false);
            await signOut(auth);
            return;
          }
          // Actualizar isActive a false
          for (const document of querySnapshot.docs) {
            const userRef = doc(db, "users", document.id);
            await updateDoc(userRef, {
              isActive: false,
              deletionRequestDate: new Date(),
              deletionInfo: {
                requestedOn: new Date(),
                scheduledDeletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                reason: "Solicitud del usuario",
              }
            });
          }
          localStorage.setItem("deletionFormUsed", "true");
          setSuccess(true);
          setIsFormDisabled(true);
          setModal({
            open: true,
            title: '¡Solicitud completada!',
            message: 'Hemos iniciado el proceso de eliminación de tus datos.',
            type: 'success',
            confirmText: 'Entendido',
            onConfirm: () => setModal((m) => ({ ...m, open: false })),
          });
        } catch (err) {
          console.error("Error al procesar la solicitud:", err);
          setError("Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.");
        } finally {
          try {
            if (auth.currentUser) {
              await signOut(auth);
            }
          } catch (signOutError) {
            console.error("Error al cerrar sesión anónima:", signOutError);
          }
          setIsLoading(false);
        }
      },
      onCancel: () => setModal((m) => ({ ...m, open: false })),
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-4 md:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Gateway Corporation
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-6 md:px-8 lg:px-10">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col w-full">
            {/* Encabezado */}
            <div className="pb-5 border-b border-gray-200 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Eliminar mis datos de usuario
              </h1>
            </div>
            
            {/* Contenido */}
            <div className="px-1">
              {!success ? (
                <>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Por favor, ingrese el correo electrónico asociado a su cuenta para iniciar el proceso de eliminación de sus datos personales.
                    </p>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <strong>Advertencia:</strong> Esta acción es irreversible. Sus datos serán marcados para eliminación y se borrarán completamente en um plazo de 3 días.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {isFormDisabled && (
                      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm">
                        Este formulario ya ha sido utilizado. Por motivos de seguridad, solo se permite una solicitud de eliminación por sesión.
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Correo Electrónico
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-sm"
                          placeholder="nombre@ejemplo.com"
                          required
                          disabled={isFormDisabled || isLoading}
                        />
                      </div>
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                          {error}
                        </div>
                      )}
                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isFormDisabled || isLoading}
                          className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
                            isFormDisabled || isLoading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700'
                          } text-base md:text-sm`}
                        >
                          {isLoading ? 'Procesando...' : isFormDisabled ? 'Formulario usado' : 'Eliminar mis datos'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Si tienes dudas sobre este proceso, puedes contactar con nuestro equipo de soporte en{' '}
                    <a href="mailto:gatewaycorporation@hotmail.com" className="text-indigo-600 hover:underline">
                      gatewaycorporation@hotmail.com
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Solicitud procesada correctamente</h2>
                  
                  <div className="text-gray-700 mb-6">
                    <p className="mb-2">
                      Hemos iniciado la eliminación de tus datos. Este proceso estará completo en los siguientes 3 días.
                    </p>
                    <p>
                      Si deseas acceder nuevamente a la plataforma, deberás contactarte con administración, porque una vez cumplido el tiempo no existirás en nuestra base de datos.
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <a 
                      href="/"
                      className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Volver al inicio
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Gateway Corporation. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
      <CustomModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm || (() => setModal((m) => ({ ...m, open: false })))}
        onCancel={modal.cancelText ? modal.onCancel : undefined}
      />
    </div>
  );
};

export default DeleteUserData;
