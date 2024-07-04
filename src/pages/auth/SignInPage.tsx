import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth/auth.store";


export const SignInPage = () => {

  const navigate = useNavigate();

  const loginUser = useAuthStore(state => state.loginUser)
  const loginGoogle = useAuthStore(state => state.loginGoogle)

  /**
   * @description Handle form submit
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // console.log('onSumbit event =>', { event })
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    try {
      loginUser(email.value, password.value)
      navigate('/dashboard');
    } catch (error) {
      console.warn('Error de autenticación', error)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Iniciar Sesión</h1>
      <form onSubmit={onSubmit}>
        {/** Email */}
        <div className="mb-4">
          <label className="block text-gray-600">Email</label>
          <input type="email" name="email" />
        </div>
        {/** Password*/}
        <div className="mb-4">
          <label className="block text-gray-600">Password</label>
          <input type="password" name="password" />
        </div>
        {/** Forget-Password*/}
        <div className=" text-blue-500">
          <a href="/auth/forgot-password" className="hover:underline">Contraseña olvidada?</a>
        </div>
        <div className="mb-6 text-blue-500">
          <a href="/auth/signup" className="hover:underline">Tienes una cuenta?</a>
        </div>

        {/** Button*/}
        <button type="submit" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">Continue with Gateway Corp 🤘🏻</button>
      </form>
      <div className="mt-5 px-6 sm:px-0 max-w-sm" onClick={loginGoogle}>
        <button type="button" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
          <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          Empezar con  Google<div></div>
        </button>

      </div>
    </>
  )
}
