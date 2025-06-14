import { useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export const ErasePage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setError("Por favor, ingrese un correo electrónico válido");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      
      // Buscar el usuario por email
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("No se encontró ninguna cuenta con este correo electrónico");
        setIsLoading(false);
        return;
      }
      
      // Actualizar el estado isActive a false para todos los documentos encontrados (normalmente solo uno)
      const updatePromises = querySnapshot.docs.map(async (document) => {
        const userRef = doc(db, "users", document.id);
        await updateDoc(userRef, {
          isActive: false,
          deletionRequestDate: new Date(),
          // Opcional: guardar información sobre la solicitud de eliminación
          deletionInfo: {
            requestedOn: new Date(),
            scheduledDeletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días después
            reason: "Solicitud del usuario"
          }
        });
      });
      
      await Promise.all(updatePromises);
      setSuccess(true);
      
    } catch (err) {
      console.error("Error al procesar la solicitud:", err);
      setError("Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
      <div className="w-full flex justify-center py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col w-full max-w-md">
          {/* Encabezado */}
          <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
            <h1 className="text-2xl font-bold text-gray-800">
              Eliminar mis datos de usuario
            </h1>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
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
                          <strong>Advertencia:</strong> Esta acción es irreversible. Sus datos serán marcados para eliminación y se borrarán completamente en un plazo de 3 días.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="nombre@ejemplo.com"
                        required
                      />
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
                          isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isLoading ? 'Procesando...' : 'Eliminar mis datos'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Si tienes dudas sobre este proceso, puedes contactar con nuestro equipo de soporte en{' '}
                  <a href="mailto:gatewaycorporation@hotmail.com" className="text-indigo-600 hover:underline">
                    gatewaycorporation@hotmail.com -  juan.intriago@purple-widget.com
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
      </div>
  );
};

export default ErasePage;
