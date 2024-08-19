
export const ForgotPassword = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
         <img src="https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd"
                    alt="Placeholder Image"
                    className="object-scale-down h-7 m-5 self-center" />
            Gateway Corp
        </a>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password? (Olvidaste tu contraseña?)
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">We undestand, the Human memory fails sometimes, but don't worry, we have a solution for your password problem but not for the memory problem. (entendemos, la memoria humana falla a veces, pero tranquilo tenemos una solucion para tu problema de contraseña pero no para el de memoria )</p>
          <p className="font-light text-gray-500 dark:text-gray-400">Don't fret! Just call your administrator and make request for send email to reset your password! (No te preocupes!, solo comunicate con tu administrador y pidele que te envìe un email de reseteo de contraseña)</p>
        </div>
      </div>
    </section>
  )
}
