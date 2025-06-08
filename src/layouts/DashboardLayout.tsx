import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { useAuthStore } from "../stores/auth/auth.store";
import { SideBar } from "../components/shared/sidemenu/SideBar";
import { FaUserCircle } from 'react-icons/fa'; // Importamos icono por defecto

export const DashboardLayout: FC = () => {
  const authStatus = useAuthStore(state => state.status);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  const user = useAuthStore(state => state.user); // Obtenemos el usuario
  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }
  {console.debug('PhotoURL:', user?.photoUrl)}
  console.debug('',{user})
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header con información del usuario */}
      <header className="h-16 bg-indigo-600 shadow-lg z-40">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo con padding adicional en móvil */}
          <div className="flex items-center gap-2 lg:ml-0 ml-16"> {/* Añadido ml-16 para móvil */}
            <img 
              src="/assets/logo.png" 
              alt="Gateway Logo" 
              className="h-14 w-auto"
            />
          </div>

          {/* Información del usuario con foto de perfil */}
          <div className="flex items-center gap-4">
            <div className="text-white text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-indigo-200">{user?.role || 'Rol'}</p>
            </div>
            
            
            {user?.photoUrl && user.photoUrl.length > 0 ? (
              <img 
                src={user.photoUrl}
                alt={`Foto de ${user.name}`}
                className="h-8 w-8 rounded-full object-cover border-2 border-white"
                onError={(e) => {
                  console.error('Error cargando la imagen:', e);
                  e.currentTarget.src = '/assets/default-avatar.png'; // Imagen por defecto si hay error
                }}
              />
            ) : (
              <FaUserCircle className="h-8 w-8 text-white" />
            )}
          </div>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
