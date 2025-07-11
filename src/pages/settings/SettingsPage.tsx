
import { useEffect, useState } from "react";
import { useEnterpriseInfoStore } from "../../stores/enterpriseinfo/enterpriseinfo.store";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditSettingsForm } from "./EditSettingsForm";
import { 
  IoBusiness, 
  IoLocation, 
  IoCall, 
  IoMail, 
  IoGlobe, 
  IoDocument, 
  IoPhonePortrait, 
  IoSettings,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoLogoYoutube,
  IoLogoTiktok
} from "react-icons/io5";

export const SettingsPage = () => {
  const { enterpriseInfo, getEnterpriseInfo, loading, error } = useEnterpriseInfoStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!enterpriseInfo) {
      getEnterpriseInfo();
    }
  }, [enterpriseInfo, getEnterpriseInfo]);

  const socialMediaIcons = {
    facebook: IoLogoFacebook,
    instagram: IoLogoInstagram,
    twitter: IoLogoTwitter,
    linkedin: IoLogoLinkedin,
    youtube: IoLogoYoutube,
    tiktok: IoLogoTiktok,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error al cargar la información</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Configuración de la Empresa
              </h1>
              <p className="text-lg text-gray-600">
                Gestiona la información y configuración de tu empresa
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <IoSettings className="w-5 h-5" />
              Editar Configuración
            </button>
          </div>

          {enterpriseInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información Básica */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <IoBusiness className="w-6 h-6 text-blue-600" />
                    Información Básica
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <IoBusiness className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700">Nombre de la Empresa</p>
                          <p className="text-gray-900 text-lg">{enterpriseInfo.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IoLocation className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700">Dirección</p>
                          <p className="text-gray-900">{enterpriseInfo.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IoDocument className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700">RUC</p>
                          <p className="text-gray-900 font-mono">{enterpriseInfo.ruc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <IoCall className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700">Teléfono</p>
                          <p className="text-gray-900">{enterpriseInfo.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <IoPhonePortrait className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-700">Móvil</p>
                          <p className="text-gray-900">{enterpriseInfo.mobileNumber}</p>
                        </div>
                      </div>
                      {enterpriseInfo.email && (
                        <div className="flex items-start gap-3">
                          <IoMail className="w-5 h-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-700">Email</p>
                            <p className="text-gray-900">{enterpriseInfo.email}</p>
                          </div>
                        </div>
                      )}
                      {enterpriseInfo.website && (
                        <div className="flex items-start gap-3">
                          <IoGlobe className="w-5 h-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-700">Sitio Web</p>
                            <a 
                              href={enterpriseInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {enterpriseInfo.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Redes Sociales */}
                {enterpriseInfo.socialMedia && Object.values(enterpriseInfo.socialMedia).some(value => value) && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Redes Sociales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(enterpriseInfo.socialMedia).map(([platform, url]) => {
                        if (!url) return null;
                        const IconComponent = socialMediaIcons[platform as keyof typeof socialMediaIcons];
                        return (
                          <div key={platform} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <IconComponent className="w-6 h-6 text-gray-600" />
                            <div>
                              <p className="font-semibold text-gray-700 capitalize">{platform}</p>
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                {url}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Condiciones Generales */}
                {enterpriseInfo.generalConditions && enterpriseInfo.generalConditions.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Condiciones Generales
                    </h2>
                    <div className="space-y-3">
                      {enterpriseInfo.generalConditions.map((condition, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Logo */}
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Logo de la Empresa</h3>
                  {enterpriseInfo.logo ? (
                    <img 
                      src={enterpriseInfo.logo} 
                      alt="Logo de la empresa"
                      className="w-32 h-32 object-contain mx-auto rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center mx-auto">
                      <IoBusiness className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Información de Sistema */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Información del Sistema</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700">Fecha de Creación</p>
                      <p className="text-gray-900 text-sm">
                        {new Date(enterpriseInfo.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Última Actualización</p>
                      <p className="text-gray-900 text-sm">
                        {new Date(enterpriseInfo.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontró información de la empresa</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para editar configuración */}
      <ModalGeneric
        isVisible={showModal}
        setIsVisible={setShowModal}
        title="Editar Configuración de la Empresa"
        children={<EditSettingsForm />}
      />
    </>
  );
};
