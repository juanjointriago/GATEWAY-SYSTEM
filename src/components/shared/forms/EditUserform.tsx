import { FC, useState } from "react"
import { FirestoreUser } from "../../../interface"
import { useForm } from "react-hook-form";
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Swal from "sweetalert2";



interface Props {
    userId: string
}

export const EditUserform: FC<Props> = ({ userId }) => {
    const updateUser = useUserStore(state => state.updateUser);
    const resetPasswordByEmail = useUserStore(state => state.resetPasswordByEmail);
    const getUserById = useUserStore(state => state.getUserById);
    const user = getUserById(userId)!;
    const animatedComponents = makeAnimated();
    const levels = useLevelStore(state => state.levels);
    const sublevels = useSubLevelStore(state => state.subLevels);
    const [levelStudent, setLevelStudent] = useState<string>();
    // console.log(levelStudent)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedSublevels, setSelectedSublevels] = useState<any>();



    const cities = [
        'Guayaquil',
        'Quito',
        'Cuenca',
        'Santo Domingo',
        'Machala,',
        'Durán',
        'Manta',
        'Portoviejo',
        'Loja',
        'Ambato',
        'Esmeraldas',
        'Quevedo',
        'Riobamba',
        'Milagro',
        'Ibarra',
        'La Libertad',
        'Babahoyo',
        'Sangolquí',
        'Daule',
        'Latacunga',
        'Tulcán',
        'Chone',
        'Pasaje',
        'Santa Rosa',
        'Nueva Loja',
        'Huaquillas',
        'El Carmen',
        'Montecristi',
        'Samborondón',
        'Puerto Francisco de Orellana',
        'Jipijapa',
        'Santa Elena',
        'Otavalo',
        'Cayambe',
        'Buena Fe',
        'Ventanas',
        'Velasco Ibarra',
        'La Troncal',
        'El Triunfo',
        'Salinas',
        'General Villamil',
        'Azogues',
        'Puyo',
        'Vinces',
        'La Concordia',
        'Rosa Zárate',
        'Balzar',
        'Naranjito',
        'Naranjal',
        'Guaranda',
        'La Maná',
        'Tena',
        'San Lorenzo',
        'Catamayo',
        'El Guabo',
        'Pedernales',
        'Atuntaqui',
        'Bahía de Caráquez',
        'Pedro Carbo',
        'Macas',
        'Yaguachi',
        'Calceta',
        'Arenillas',
        'Jaramijó',
        'Valencia',
        'Machachi',
        'Shushufindi',
        'Atacames',
        'Piñas',
        'San Gabriel',
        'Gualaceo',
        'Lomas de Sargentillo',
        'Cañar',
        'Cariamanga',
        'Baños de Agua Santa',
        'Montalvo',
        'Macará',
        'San Miguel de Salcedo',
        'Zamora',
        'Puerto Ayora',
        'La Joya de los Sachas',
        'Salitre',
        'Tosagua',
        'Pelileo',
        'Pujilí',
        'Tabacundo',
        'Puerto López',
        'San Vicente',
        'Santa Ana',
        'Zaruma',
        'Balao',
        'Rocafuerte',
        'Yantzaza',
        'Cotacachi',
        'Santa Lucía',
        'Cumandá',
        'Palestina',
        'Alfredo Baquerizo Moreno',
        'Nobol',
        'Mocache',
        'Puebloviejo',
        'Portovelo',
        'Sucúa',
        'Guano',
        'Píllaro',
        'Simón Bolívar',
        'Gualaquiza',
        'Paute',
        'Saquisilí',
        'Cnel. Marcelino Maridueña',
        'Paján',
        'San Miguel',
        'Puerto Baquerizo Moreno',
        'Catacocha',
        'Palenque',
        'Alausí',
        'Caluma',
        'Catarama',
        'Flavio Alfaro',
        'Colimes',
        'Echeandía',
        'Jama',
        'Gral. Antonio Elizalde (Bucay)',
        'Isidro Ayora',
        'Muisne',
        'Santa Isabel',
        'Pedro Vicente Maldonado',
        'Biblián',
        'Archidona',
        'Junín',
        'Baba',
        'Valdez (Limones)',
        'Pimampiro',
        'Camilo Ponce Enríquez',
        'San Miguel de Los Bancos',
        'El Tambo',
        'Quinsaloma',
        'El Ángel',
        'Alamor',
        'Chambo',
        'Chimbo',
        'Celica',
        'Chordeleg',
        'Balsas',
        'Saraguro',
        'El Chaco',
        'Girón',
        'Huaca',
        'Pichincha',
        'Chunchi',
        'Pallatanga',
        'Marcabelí',
        'Sígsig',
        'Gral. Leonidas Plaza Gutiérrez (Limón)',
        'Urcuquí',
        'Loreto',
        'Rioverde',
        'Zumba',
        'Palora',
        'Mira',
        'El Pangui',
        'Puerto Quito',
        'Bolívar',
        'Sucre',
        'Chillanes',
        'Quero',
        'Guamote',
        'Cevallos',
        'Zapotillo',
        'Villa La Unión (Cajabamba)',
        'Santiago de Méndez',
        'Zumbi',
        'Puerto El Carmen de Putumayo',
        'Patate',
        'Olmedo',
        'Puerto Villamil',
        'El Dorado de Cascales',
        'Lumbaqui',
        'Palanda',
        'Sigchos',
        'Pindal',
        'Guayzimi',
        'Baeza',
        'El Corazón',
        'Paccha',
        'Amaluza',
        'Las Naves',
        'Logroño',
        'San Fernando',
        'Gonzanamá',
        'San Juan Bosco',
        'Yacuambi',
        'Santa Clara',
        'Arajuno',
        'Tarapoa',
        'Tisaleo',
        'Suscal',
        'Nabón',
        'Mocha',
        'La Victoria',
        'Guachapala',
        'Santiago',
        'Chaguarpamba',
        'Penipe',
        'Taisha',
        'Chilla',
        'Paquisha',
        'Carlos Julio Arosemena Tola',
        'Sozoranga',
        'Pucará',
        'Huamboya',
        'Quilanga',
        'Oña',
        'Sevilla de Oro',
        'Mera',
        'Pablo Sexto',
        'Olmedo',
        'Déleg',
        'La Bonita',
        'El Pan',
        'Tiputini',

    ]
    const roles = [
        { value: 'teacher', label: 'Teacher' },
        { value: 'student', label: 'Student' },
        { value: 'admin', label: 'Administrator Be carefull' }
    ]
    console.log('EditUserForm Found User by id', { user });
    const defaultValues: FirestoreUser = {
        ...user,
        updatedAt: Date.now()
    };
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FirestoreUser>({ defaultValues });
    const onSubmit = handleSubmit((async (data) => {
        if (!levelStudent && watch('role') === 'student') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe seleccionar una modalidad',
            })
            return;
        }
        data.level = levelStudent ?? "";
        if ((sublevels.length === 0) && (selectedSublevels)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe seleccionar una unidad',
            });
            return
        }
        if (watch('role') === 'student') {
            data.subLevel = selectedSublevels.value;
        }
        const updatedUser = {
            ...defaultValues,
            ...data
        }
        console.log('👀====>', { updatedUser });
        // return
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Estas a punto de actualizar los datos de ${user.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await updateUser(updatedUser);
                window.location.reload();
            }
        })
        // await updateUser(updatedUser);
        // reset(defaultValues);
    }))

    console.log('👀', watch('role'));
    return (
        <div>
            {/* <h1 className="text-2xl font-semibold mb-4">{`${user.name}` }</h1> */}
            <form className="w-full max-w-lg" onSubmit={onSubmit}>
                {/** Name */}
                <div className="mb-4">
                    <label className="block text-gray-600">Nombre</label>
                    <input
                        {...register("name", { required: "El nombre es obligatorio 👀", })}
                        type="text"
                        id="name"
                        placeholder='Ej. Juan Pérez'
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                </div>
                <div className='flex flex-row'>
                    {/** CC */}
                    <div className="mb-4 ">
                        <label className="block text-gray-600">CC:</label>
                        <input
                            {...register("cc", { required: "El nro de cc es obligatorio 👀", pattern: { value: /^[0-9]*$/, message: 'Sólo se permiten números entre 0 y 9 ' } })}
                            type="text"
                            maxLength={13}
                            placeholder='10123000009 o 10123000009001'
                            id="cc"
                        />
                        {errors.cc && <p className="text-red-500 text-xs italic">{errors.cc.message}</p>}
                    </div>

                    {/** Ciudad*/}
                    <div className="mb-4 ml-2">
                        <label htmlFor="sublevel" className="block text-gray-600">Ciudad</label>
                        <select
                            {...register("city", { required: "Ciudad" })}
                            id="sublevel"
                            defaultValue={''}
                            className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
                            <option value={''}>Seleccione rol</option>
                            {
                                cities.map((city, index) => {
                                    return <option key={index} value={city}>{city}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                {/*Role*/}
                <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                    <label className="block text-gray-600">Rol:</label>

                    <select
                        {...register("role", { required: "Debe Seleciconar un rol 👀" })}
                        id="sublevel"
                        defaultValue={user.role}
                        className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white">
                        <option value={''}>Seleccione Rol</option>
                        {
                            roles.map((role, index) => {
                                return <option key={index} value={role.value}>{role.label}</option>
                            })
                        }
                    </select>
                </div>
                {/*Level*/}
                {watch('role') === 'student' && <>
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <Select
                            components={animatedComponents}
                            placeholder="Modalidad"
                            defaultInputValue={levels.find(level => level.id === user.level)?.name}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options={levels.map(level => ({ value: level.id, label: level.name })) as any}
                            // {...register("teacher", { required: "El minimo de estudiantes es obligatorio👀" })}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e: any) => {
                                console.log('LEVELID', e.value);
                                if (!e.value) return
                                setLevelStudent(e.value);
                            }}
                            required={false}
                        />
                    </div>
                    {/*SubLevels*/}
                    <div className="mb-3 w-full md:w-1/1 px-3 mt-2">
                        <div className="bg-indigo-300 w-[auto] rounded-sm ">
                        </div>
                        <Select
                            id="sublevels"
                            components={animatedComponents}
                            defaultInputValue={sublevels.find(sublevel => sublevel.id === user.subLevel)?.name}

                            placeholder="Unidad "
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options={sublevels.map(sublevel => ({ value: sublevel.id, label: sublevel.name })) as any}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(e: any) => {
                                console.log('SUB-LEVELID', { e });
                                setSelectedSublevels(e);
                            }}
                        />
                    </div>
                </>}
                {/** Email */}
                <div className="mb-4">
                    <label className="block text-gray-600">Email</label>
                    <input
                        {...register("email", { required: "El email es obligatorio 👀" })}
                        type="email"
                        id="email"
                    />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                </div>
                {watch('role') === 'teacher' && <div className='flex flex-row justify-between'>
                    {/** TeacherLink*/}
                    <div className="mb-4 w-full">
                        <label className="block text-gray-600">Teacher Link</label>
                        <input
                            {...register("teacherLink")}
                            type="text"
                            id="teacherLink"
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    </div>
                </div>}
                {/** Dirección*/}
                <div className="mb-4">
                    <label className="block text-gray-600">Dirección</label>
                    <input
                        {...register("address", { required: "La dirección es obligatoria 👀" })}
                        type="text"
                        id="address"
                    />
                    {errors.address && <p className="text-red-500 text-xs italic">{errors.address.message}</p>}
                </div>
                {/** Telefono*/}
                <div className="mb-4">
                    <label className="block text-gray-600">Teléfono de contacto</label>
                    <input
                        {...register("phone", { required: "El teléfono es obligatorio 👀" })}
                        type="text"
                        id="phone"
                    />
                    {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                </div>

                {/** Button*/}

                <button type="submit" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">Guardar Cambios 🤘🏻</button>
                <div className="flex mt-5 underline justify-end text-blue-500">
                </div>
            </form>
            <button
                type="button"
                className="text-white w-[70%]  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2"
                onClick={() => resetPasswordByEmail(user.email)}>
                Enviar correo para reinicio de contraseña 🔑
            </button>
        </div>
    )
}
