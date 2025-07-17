import { FC, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { useAuthStore } from "../stores/auth/auth.store";
import { SideBar } from "../components/shared/sidemenu/SideBar";
import { ScrollWrapper } from "../components/shared/wrappers/ScrollWrapper";
import Header from "../components/shared/Header";
import { RiMenu4Line } from "react-icons/ri";

export const DashboardLayout: FC = () => {
  const authStatus = useAuthStore(state => state.status);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }
  // {console.debug('PhotoURL:', user?.photoUrl)}
  // console.debug('',{user})
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header mejorado */}
      <Header 
        onToggleSidebar={toggleSidebar} 
        onOpenSidebar={openSidebar}
        isSidebarOpen={isSidebarOpen} 
      />

      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <ScrollWrapper className="flex-1 bg-gray-50 main-content">
          <div className="container mx-auto p-4 min-h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
              <Outlet />
            </div>
          </div>
        </ScrollWrapper>
      </div>
      {isMobile && !isSidebarOpen && (
        <button
          onClick={openSidebar}
          className="fixed top-2 left-2 z-[9996] p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors lg:hidden"
          aria-label="Abrir menú"
        >
          <RiMenu4Line size={24} />
        </button>
      )}
    </div>
  );
};
