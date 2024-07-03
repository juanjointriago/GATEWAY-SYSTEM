import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth/auth.store";


export const SignInPage = () => {

  const navigate = useNavigate();

  const loginUser = useAuthStore(state => state.loginUser)

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
        {/** Remember-me*/}
        {/* <div className="mb-4 flex items-center">
          <input type="checkbox" name="remember" className="text-blue-500" />
          <label className="text-gray-600 ml-2">Remember Me</label>
        </div> */}
        {/** Forget-Password*/}
        <div className=" text-blue-500">
          <a href="/auth/forgot-password" className="hover:underline">Contraseña olvidada?</a>
        </div>
        <div className="mb-6 text-blue-500">
          <a href="/auth/signup" className="hover:underline">Tienes una cuenta?</a>
        </div>

        {/** Button*/}
        <button type="submit" className="bg-indigo-600">Login</button>

      </form>
    </>
  )
}
