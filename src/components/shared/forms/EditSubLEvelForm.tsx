import { FC } from "react"
import { subLevel } from "../../../interface"
import { useSubLevelStore } from "../../../stores"
import { Controller, useForm } from "react-hook-form"
import Swal from "sweetalert2"

interface Props {
    subLevelId: string
}
export const EditSubLEvelForm: FC<Props> = ({ subLevelId }) => {
    console.log(subLevelId)
    const getSubLevelById = useSubLevelStore(state => state.getSubLevelById);
    const updateSubLevel = useSubLevelStore(state => state.updateSubLevel);
    // const levels = useLevelStore(state => state.levels);
    const defaultValues: subLevel = {
        ...getSubLevelById(subLevelId)!,
        updatedAt: Date.now(),
    }
    const { control, handleSubmit, reset, formState: { errors } } = useForm<subLevel>({ defaultValues });
    const onSubmit = handleSubmit(async (data: subLevel) => {
        // console.log({ unitRecord })
        //return
        await updateSubLevel(data).then(() => {
            Swal.fire({
                title: 'Unidad actualizada',
                text: `Unidad actualizada con éxito`,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            }).then((result) => { if (result.isConfirmed) window.location.reload(); })
        }).catch((error) => {
            Swal.fire('Error', `${error.message}`, 'error');
            console.error(error);
        });
        reset(defaultValues);
    });
    return (
        <>
            <div className="flex ">
                <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>

                    <div className="flex flex-wrap mx-3 mb-6">
                        <div className="w-full md:w-1/1 px-3 mt-2 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                Nombre *
                            </label>
                            <Controller
                                rules={{ required: "El nombre es obligatorio 👀" }}
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <input
                                        id="name"
                                        {...field}
                                        type="text"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                        placeholder="Ej. Unidad 1" />
                                )}
                            />

                            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                        </div>
                        <div className="w-full md:w-1/1 mt-2 px-3">
                            <label className="inline-flex items-center cursor-pointer">
                            <Controller
                                // rules={{ required: "Este campo debe registrarse por primera vez como Activo 👀" }}//justneed those for create or not?
                                control={control}
                                name="isActive"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <input
                                        onBlur={onBlur}
                                        onChange={() => onChange(!value)}
                                        checked={value}
                                        ref={ref}
                                        id="isActive"
                                        type="checkbox"
                                        className="sr-only peer"
                                    />
                                )}
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
        </>
    )
}
