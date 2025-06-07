import { useForm } from "react-hook-form";
import { subLevel } from "../../../interface";
import { v4 as uuid } from 'uuid'

import { useSubLevelStore } from "../../../stores";
import Swal from "sweetalert2";



export const SublevelForm = () => {
    const createSublevel = useSubLevelStore(state => state.createSubLevel);
    // const levels = useLevelStore(state => state.levels);
    const defaultValues: subLevel = {
        name: '',
        // parentLevel: '',
        // maxAssistantsNumber: 10,
        // minAssistantsNumber: 1,
        isActive: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm<subLevel>({ defaultValues });
    const onSubmit = handleSubmit(async (data: subLevel) => {
        const unitRecord = { id: uuid(), ...data };
        // console.debug({ unitRecord })
        //return
        await createSublevel(unitRecord).then(() => {
            Swal.fire({
                title: 'Unidad creada',
                text: `Unidad creada con éxito`,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              })

        }).catch((error) => {
            Swal.fire('Error', `${error.message}`, 'error');
            console.error(error);
        });
        reset();
    });
    return (
        <div className="flex ">
            <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>
                <div className="flex flex-wrap mx-3 mb-6">
                    <div className="w-full md:w-1/1 px-3 mt-2 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                            Nombre *
                        </label>
                        <input
                            {...register("name", { required: "El nombre es obligatorio 👀", })}
                            id="name"
                            type="text"
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            placeholder="Ej. Unidad 1" />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>
                    <div className="w-full md:w-1/1 mt-2 px-3">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                {...register("isActive", { required: "Este campo debe registrarse por primera vez como Activo 👀" })}
                                id="isActive"
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
                        </label>
                        {errors.isActive && <p className="text-red-500 text-xs italic">{errors.isActive.message}</p>}
                    </div>
                </div>
                <div className="flex h-[30%] justify-`end` ]">
                    <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
                        type="submit"
                    >💾</button>
                </div>
            </form>
        </div>
    )
}
