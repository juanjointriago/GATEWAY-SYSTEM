import { BiLogOut } from "react-icons/bi";
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
          <button className="hidden sm:flex p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 ">
            <img src={user?.photoUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
          </button>

          {/* Menú de usuario */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role.toUpperCase() || 'ROL'}
                </p>
              </div>
              
              <button
                onClick={logoutUser}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Cerrar sesión"
              >
                <BiLogOut size={20} color="white"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
