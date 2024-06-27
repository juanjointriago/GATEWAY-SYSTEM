import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../stores/auth/auth.store";
import { Loading } from "../components/shared/ui/Loading";

export const AuthLayout = () => {
  const authStatus = useAuthStore(state => state.status);
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  if (authStatus === 'pending') {
    checkAuthStatus();
    return <Loading />
  }
  
  if (authStatus === 'authorized') {
    checkAuthStatus();
    return <Navigate to="/dashboard" />
  }
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:flex lg:flex-col items-center justify-center bg-indigo-700">
        <span className="text-white font-bold text-9xl">Gateway English</span>
        {/** 
        *<img src="" alt="Place holder Image"/>
        */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
