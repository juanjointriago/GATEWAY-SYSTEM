import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../components/shared/ui/Loading";

import { useAuthStore } from "../stores/auth/auth.store";
import { SideMenu } from "../components";
// import { SideBar } from "../components/shared/sidemenu/SideBar";
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



  // console.log(JSON.stringify(authStatus))
  return (
    <div className="overflow-x-auto bg-slate-200 overflow-y-scroll w-screen h-screen text-slate-900 selection:bg-blue-900 selection:text-white">
      <div className="flex flex-row relative w-screen">
        <SideMenu />
        {/* <SideBar /> */}
        <div className="w-full">
          <Outlet />
        </div>

      </div>

    </div>
  )
}
