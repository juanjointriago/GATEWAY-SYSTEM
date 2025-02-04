export const Policies = () => {
  return (
    <>
      <div className="w-[600px] mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">
            Política de Privacidad
          </h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">
            Gateway Corporation - Reservaciones de Clases de Inglés
          </h2>

          <div className="h-[500px] pr-4 overflow-y-auto">
            <div className="space-y-4 text-gray-700">
              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  1. Información Recopilada
                </h3>
                <p>
                  Recopilamos información personal necesaria para gestionar
                  reservaciones de clases de inglés, incluyendo:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información de pago</li>
                  <li>Nivel de inglés</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  2. Uso de la Información
                </h3>
                <p>La información recopilada se utiliza para:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Gestionar reservaciones de clases</li>
                  <li>Comunicación sobre horarios y servicios</li>
                  <li>Mejora de nuestros servicios educativos</li>
                  <li>Procesamiento de pagos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  3. Protección de Datos
                </h3>
                <p>
                  Implementamos medidas de seguridad tecnológicas y
                  organizativas para proteger su información personal contra
                  acceso no autorizado, alteración o destrucción.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  4. Compartir Información
                </h3>
                <p>
                  No vendemos ni compartimos información personal con terceros
                  sin su consentimiento, excepto cuando sea necesario para
                  prestar nuestros servicios.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  5. Derechos del Usuario
                </h3>
                <p>Usted tiene derecho a:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Acceder a su información personal</li>
                  <li>Solicitar corrección de datos inexactos</li>
                  <li>Solicitar eliminación de datos</li>
                  <li>Oponerse al procesamiento de datos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  6. Cookies y Tecnologías de Rastreo
                </h3>
                <p>
                  Utilizamos cookies para mejorar la experiencia del usuario y
                  analizar el tráfico en nuestra aplicación.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-blue-500 mb-2">
                  7. Contacto
                </h3>
                <p className="text-gray-700 mb-4">
                  Si tiene preguntas o inquietudes sobre nuestra política de
                  privacidad, puede contactarnos:
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800 font-semibold">
                    Gateway Corporation
                  </p>
                  <p className="text-gray-700">
                    Correo electrónico: gatewaycorporation@hotmail.com
                  </p>
                  <p className="text-gray-700">Teléfono: +593 (098) 754-8369</p>
                  <p className="text-gray-700">Teléfono: +593 (099) 265-0605</p>
                </div>
              </section>
              <section className="text-sm text-gray-500 mt-6">
                <p>Última actualización: Febrero 2024</p>
              </section>
            </div>
          </div>
        </div>
              <section className="text-center mt-8">
                <p className="text-gray-600 italic">
                  Última actualización: {new Date().toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  © {new Date().getFullYear()} Gateway Corporation -
                  Puple-Widget Todos los derechos reservados.
                </p>
              </section>

              
      </div>
    </>
  );
};
