import { useAuthStore } from '../../../stores';
import { newUSer } from '../../../interface';
import { useForm } from 'react-hook-form';

export const SignUpForm = () => {

  const signUp = useAuthStore(state => state.sigUpUser);

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


  const defaultValues: newUSer = {
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    phone: '',
    address: '',
    bornDate: '',
    cc: '',
    city: '',
    country: 'Ecuador',
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<newUSer>({ defaultValues });


  const onSubmit = handleSubmit((async (data) => {
    const newUser = {
      ...defaultValues,
      ...data
    }
    console.log(newUser);
    // return
    await signUp(newUser);
    reset()
  }))



  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Registro de Nuevo Usuario</h1>
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
              <option value={''}>Seleccione ciudad</option>
              {
                cities.map((city, index) => {
                  return <option key={index} value={city}>{city}</option>
                })
              }
            </select>
          </div>
        </div>
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
        <div className='flex flex-row justify-between'>
          {/** Password*/}
          <div className="mb-4">
            <label className="block text-gray-600">Contraseña</label>
            <input
              {...register("password", { required: "La contraseña es obligatoria 👀", minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' } })}
              type="password"
              name="password"
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}

          </div>
          {/** Password2*/}
          <div className="mb-4">
            <label className="block text-gray-600">Repita Contraseña</label>
            <input
              {...register("password2", { required: "Debe repetir la contraseña  👀", validate: value => value === getValues('password') || 'Las contraseñas no coinciden' })}
              type="password"
              id="password2"
            />
            {errors.password2 && <p className="text-red-500 text-xs italic">{errors.password2.message}</p>}
          </div>
        </div>

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
            type="tel"
            id="phone"
          />
          {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
        </div>

        {/** BornDate*/}
        <div className="mb-4 text-blue-500">
          <p className="hover:underline">Fecha de cumpleaños 🎂</p>
          <input type="date" name="bornDate" />

        </div>

        {/** Button*/}
        <button type="submit" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">Registrarme 🤘🏻</button>
        <button className="mt-5   text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">
          <a href="/auth/signin" className="hover:underline">Ya eres estudiante? Continúa por aquí ✅</a>
        </button>
      </form>
    </>
  )
}
