import React from 'react';
import { useAuthStore } from '../../stores/auth/auth.store';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSidebar?: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSidebar, isSidebarOpen }) => {
  const { user, logoutUser } = useAuthStore();

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Botón hamburguesa y logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={isSidebarOpen ? onToggleSidebar : (onOpenSidebar || onToggleSidebar)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hamburger-animation"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo.png" 
              alt="Gateway Academic" 
              className="h-8 w-auto"
            />
            <span className="hidden sm:block text-xl font-bold text-gray-800">
              Gateway System
            </span>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones (placeholder) */}
          <button className="hidden sm:flex p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-6a6 6 0 10-12 0v6" />
            </svg>
          </button>

          {/* Menú de usuario */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || 'Rol'}
                </p>
              </div>
              
              <button
                onClick={logoutUser}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
