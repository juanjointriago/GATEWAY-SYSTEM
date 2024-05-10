import { FormEvent } from "react"


export const SignInPage = () => {

  /**
   * @description Handle form submit
   */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log('onSumbit event =>', { event })
    event.preventDefault();
    const { username, password, remember } = event.target as typeof event.target & {
      username: { value: string };
      password: { value: string };
      remember: { checked: boolean }
    };
    console.log(username.value, password.value, remember.checked);
    username.value = '';
    password.value = '';
    remember.checked = false;
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
        <div className="mb-4 flex items-center">
          <input type="checkbox" name="remember" className="text-blue-500" />
          <label className="text-gray-600 ml-2">Remember Me</label>
        </div>

        <div className="mb-6 text-blue-500">
          <a href="/forget-password" className="hover:underline">Contraseña olvidada?</a>
        </div>
        <button type="submit" className="bg-indigo-600">Login</button>

      </form>
    </>
  )
}
