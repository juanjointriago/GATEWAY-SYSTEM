import { Suspense } from "react"
import { Loading } from "../components/shared/ui/Loading"
import { Outlet } from "react-router-dom"

export const LanddingLayout = () => {
  return (
    <>
     <div className="bg-gray-100 flex justify-center items-center h-screen">
          <div className="w-1/2 h-screen hidden lg:flex lg:flex-col items-center justify-center bg-indigo-500">
            {/* <span className="text-white font-bold text-8xl">Gateway Corporation</span> */}
            <Suspense fallback={<Loading />}>
              <img src="https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd"
                alt="Placeholder Image"
                className="object-scale-down w-auto h-auto" />
            </Suspense>
          </div>
          <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/1">
            <Outlet />
          </div>
        </div>
    </>
  )
}
