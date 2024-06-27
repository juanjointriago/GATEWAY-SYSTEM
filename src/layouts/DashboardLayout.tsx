import { Navigate, Outlet } from "react-router-dom";
import { SideMenu } from "../components";
import { Loading } from "../components/shared/ui/Loading";

export const DashboardLayout = () => {
  const authStatus = {}
  const checkAuthStatus = () => { }

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/login" />
  }

  console.log({ authStatus })
  return (
    <div className="bg-slate-200 overflow-y-scroll w-screen h-screen antialiased text-slate-900 selection:bg-blue-900 selection:text-white">
      <div className="flex flex-row relative w-screen">
        <SideMenu />

        <div className="w-full p-4">
          <Outlet />
        </div>

      </div>

    </div>
  )
}
