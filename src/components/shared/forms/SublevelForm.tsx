import { useForm } from "react-hook-form";
import { subLevel } from "../../../interface";
import { v4 as uuid } from 'uuid'

import { useLevelStore, useSubLevelStore } from "../../../stores";
import Swal from "sweetalert2";



export const SublevelForm = () => {
    const createSublevel = useSubLevelStore(state => state.createSubLevel);
    const levels = useLevelStore(state => state.levels);
    const defaultValues: subLevel = {
        name: '',
        parentLevel: '',
        maxAssistantsNumber: 10,
        minAssistantsNumber: 1,
        isActive: false,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm<subLevel>({ defaultValues });
    const onSubmit = handleSubmit(async (data: subLevel) => {
        const unitRecord = { id: uuid(), ...data };
        Swal.fire({
            title: 'Creando Unidad',
            html: 'Espere un momento por favor',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()  //swal loading
            },
        })
        await createSublevel(unitRecord).then(() => {
            console.log('ITS ok');
            Swal.close();
            Swal.fire('DATA', `${unitRecord}`, 'info');
            Swal.fire('Unidad creado', 'Unidad creado con éxito', 'success');

        }).catch((error) => {
            Swal.fire('Error', `${error.message}`, 'error');
            console.error(error);
        });
        Swal.close();
        console.log({ unitRecord })
        reset();
    })
    return (
        <div className="flex ">
            <form className=" flex w-full max-w-lg" onSubmit={onSubmit}>

                <div className="flex flex-wrap mx-3 mb-6">
                    <div className="w-full md:w-1/1 px-3 mb-6 md:mb-0">
                        <label htmlFor="parentLevel" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Modalidad a la que pertenece</label>
                        <select
                            {...register("parentLevel", { required: "La modalidad es obligatorio 👀" })}
                            id="parentLevel"
                            defaultValue={''}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
                            <option value={''}>Seleccione la modalidad</option>
                            {
                                levels.map((level) => {
                                    return <option key={level.id} value={level.id}>{level.name}</option>
                                })
                            }
                        </select>
                        {errors.parentLevel && <p className="text-red-500 text-xs italic">{errors.parentLevel.message}</p>}
                    </div>
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

                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="maxAssistantsNumber">
                            Número máximo de estudiantes *
                        </label>
                        <input
                            {...register("maxAssistantsNumber", { required: "El maximo de estudiantes es obligatorio👀" })}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="maxAssistantsNumber"
                            type="number" maxLength={10} minLength={1} />
                        {errors.maxAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.maxAssistantsNumber.message}</p>}
                    </div>
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                            Número mínimo de estudiantes *
                        </label>
                        <input
                            {...register("minAssistantsNumber", { required: "El maximo de estudiantes es obligatorio👀" })}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="minAssistantsNumber"
                            type="number" maxLength={10} minLength={1} />
                        {errors.minAssistantsNumber && <p className="text-red-500 text-xs italic">{errors.minAssistantsNumber.message}</p>}
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
                <div className="flex h-[10%] justify-`end` ]">
                    <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
                        type="submit"
                    >💾</button>
                </div>
            </form>
        </div>
    )
}
