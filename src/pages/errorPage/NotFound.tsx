import { FC } from "react"
import { NavLink } from "react-router-dom"
interface Props { }
export const NotFound: FC<Props> = () => {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">\
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing (Algo salió mal)</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page.(Lo sentimos no encontramos la pagina que escribes) </p>
                    <NavLink to={'/'}>
                        <p className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage (Volver a la pagina de Inicio)</p>
                    </NavLink>
                <img src="https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd"
                    alt="Placeholder Image"
                    className="object-scale-down h-72 self-center" />
                </div>
            </div>
        </section>
    )
}
