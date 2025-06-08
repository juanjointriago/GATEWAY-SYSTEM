import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";
import { useAuthStore } from "../stores/auth/auth.store";
import { SideBar } from "../components/shared/sidemenu/SideBar";

export const DashboardLayout: FC = () => {
  const authStatus = useAuthStore(state => state.status);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header fijo */}
      <header className="h-16 bg-indigo-600 shadow-lg z-40">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo o título */}
          <h1 className="text-xl font-semibold text-white">Gateway System</h1>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />

        {/* Contenido principal con scroll */}
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
