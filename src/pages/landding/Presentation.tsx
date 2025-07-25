import  { useState } from "react";

const stats = [
  { label: "Matrículas", value: 120 },
  { label: "Pagos procesados", value: 350 },
  { label: "Contratos activos", value: 80 },
  { label: "Progress Sheets", value: 110 },
];

const advantages = [
  { icon: "🗂️", text: "Centralización de la información" },
  { icon: "🤖", text: "Automatización de procesos" },
  { icon: "📈", text: "Escalabilidad" },
  { icon: "🔒", text: "Seguridad" },
  { icon: "🛠️", text: "Soporte y mantenimiento" },
];

const future = [
  { icon: "📲", title: "Notificaciones Push", desc: "Envío a grupos o usuarios específicos." },
  { icon: "📆", title: "Integración Calendarios", desc: "Sincronización con iOS y Android." },
  { icon: "🧾", title: "Facturación Electrónica SRI", desc: "Emisión de facturas electrónicas." },
  { icon: "🌐", title: "Landing Page Autoadministrable", desc: "Gestión web institucional desde el sistema." },
  { icon: "👩‍💼", title: "Recursos Humanos", desc: "Gestión de empleados, nómina y caja." },
  { icon: "📊", title: "Estadísticas y Reportes", desc: "Medición de desempeño docente y reportes personalizados." },
  { icon: "🎨", title: "Servicios de Valor Agregado", desc: "Redes sociales, diseño y presencia digital." },
];

export const Presentation = () => {
  const [modal, setModal] = useState<{ open: boolean, title: string, desc: string, icon: string } | null>(null);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-[100vh] w-full flex justify-center px-0 md:px-8">
      <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-2xl p-4 md:p-12 overflow-y-auto" style={{maxHeight: '100vh'}}>
        <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-700 mb-2 flex items-center gap-2">🚀 Gateway Academic</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">Plataforma integral para la gestión académica, administrativa y financiera de instituciones educativas. Rápida, responsiva y accesible desde cualquier dispositivo.</p>

        {/* Dashboard Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">📊 Dashboard Centralizado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-indigo-100 rounded-xl p-4 flex flex-col items-center shadow-md">
                <span className="text-3xl font-bold text-indigo-700">{stat.value}</span>
                <span className="text-sm text-gray-600 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Módulo de Pagos y Contratos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2 flex items-center gap-2">💳 Módulo de Pagos, Contratos y Progress Sheet</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>📑 <b>Gestión de contratos:</b> Registro, consulta y administración de contratos vinculados al progreso académico.</li>
            <li>💳 <b>Pagos integrados:</b> Registro de pagos, estado de cuenta y reportes de pagos pendientes o realizados.</li>
            <li>📈 <b>Progress Sheet:</b> Hoja de progreso por estudiante, vinculada a su contrato.</li>
          </ul>
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <b>Ventajas:</b>
            <ul className="list-none grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <li>✅ Reducción de errores administrativos</li>
              <li>🔗 Trazabilidad total de pagos y contratos</li>
              <li>🚀 Acceso rápido a información financiera y académica</li>
              <li>💡 Gestión de cobranzas y seguimiento de morosidad</li>
            </ul>
          </div>
        </section>

        {/* Experiencia de Usuario */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2 flex items-center gap-2">🧭 Acceso Rápido y Experiencia de Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 shadow">
              <span className="text-lg">Interfaz intuitiva 🧭</span>
              <p className="text-gray-600 text-sm mt-1">Navegación sencilla, menús claros y accesos directos.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 shadow">
              <span className="text-lg">Velocidad ⚡️</span>
              <p className="text-gray-600 text-sm mt-1">Tiempos de carga mínimos y respuesta inmediata.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 shadow">
              <span className="text-lg">Soporte multiusuario 👥</span>
              <p className="text-gray-600 text-sm mt-1">Acceso diferenciado por roles (admin, docente, estudiante, financiero).</p>
            </div>
          </div>
        </section>

        {/* Ventajas Competitivas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2 flex items-center gap-2">🏆 Ventajas Competitivas</h2>
          <div className="flex flex-wrap gap-4">
            {advantages.map((adv) => (
              <div key={adv.text} className="flex items-center gap-2 bg-white border border-indigo-100 rounded-lg px-4 py-2 shadow-sm">
                <span className="text-2xl">{adv.icon}</span>
                <span className="text-gray-700 font-medium">{adv.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trabajos Futuros y Propuestas de Valor */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2 flex items-center gap-2">🔮 Trabajos Futuros y Propuestas de Valor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {future.map((f) => (
              <button
                key={f.title}
                className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl p-4 flex items-start gap-3 shadow hover:scale-105 transition-transform focus:outline-none"
                onClick={() => setModal({ open: true, title: f.title, desc: f.desc, icon: f.icon })}
              >
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <span className="font-bold text-indigo-700">{f.title}</span>
                  <p className="text-gray-600 text-sm line-clamp-2">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Modal de detalle */}
        {modal?.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600 text-2xl"
                onClick={() => setModal(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{modal.icon}</span>
                <span className="text-2xl font-bold text-indigo-700">{modal.title}</span>
              </div>
              <p className="text-gray-700 text-lg">{modal.desc}</p>
            </div>
          </div>
        )}

        {/* Conclusión */}
        <section className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">🏁 Conclusión</h2>
          <p className="text-lg text-gray-700 mb-4">Gateway Academic es una solución <b>robusta</b>, <b>moderna</b> y <b>escalable</b> que centraliza la gestión educativa, administrativa y financiera, con una visión clara hacia la <b>automatización</b>, <b>integración</b> y <b>crecimiento digital</b> de la institución.</p>
          <p className="text-xl font-semibold text-indigo-600 mt-6">¿Listo para llevar la gestión académica al siguiente nivel? 🚀</p>
        </section>
      </div>
    </div>
  );
}
