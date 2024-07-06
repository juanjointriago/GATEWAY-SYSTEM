import { Navigate, Outlet } from "react-router-dom";
import { SideMenu } from "../components";
import { Loading } from "../components/shared/ui/Loading";
import { useAuthStore } from "../stores/auth/auth.store";

export const DashboardLayout = () => {
  const authStatus = useAuthStore(state => state.status);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }

  
  console.log(JSON.stringify(authStatus))
  return (
    <div className="overflow-hidden bg-slate-200 overflow-y-scroll w-screen h-screen antialiased text-slate-900 selection:bg-blue-900 selection:text-white">
      <div className="flex flex-row relative w-screen">
        <SideMenu />
        <div className="w-full">
          <Outlet />
        </div>

      </div>

    </div>
  )
}
