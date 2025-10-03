import { useAuthStore } from "../../../stores";
import { newUSer } from "../../../interface";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loading } from "../ui/Loading";

export const SignUpForm = () => {
  const signUp = useAuthStore((state) => state.sigUpUser);

  const [isLoading, setIsLoading] = useState(false);

  const cities = [
    "Guayaquil",
    "Quito",
    "Cuenca",
    "Santo Domingo",
    "Machala,",
    "Durán",
    "Manta",
    "Portoviejo",
    "Loja",
    "Ambato",
    "Esmeraldas",
    "Quevedo",
    "Riobamba",
    "Milagro",
    "Ibarra",
    "La Libertad",
    "Babahoyo",
    "Sangolquí",
    "Daule",
    "Latacunga",
    "Tulcán",
    "Chone",
    "Pasaje",
    "Santa Rosa",
    "Nueva Loja",
    "Huaquillas",
    "El Carmen",
    "Montecristi",
    "Samborondón",
    "Puerto Francisco de Orellana",
    "Jipijapa",
    "Santa Elena",
    "Otavalo",
    "Cayambe",
    "Buena Fe",
    "Ventanas",
    "Velasco Ibarra",
    "La Troncal",
    "El Triunfo",
    "Salinas",
    "General Villamil",
    "Azogues",
    "Puyo",
    "Vinces",
    "La Concordia",
    "Rosa Zárate",
    "Balzar",
    "Naranjito",
    "Naranjal",
    "Guaranda",
    "La Maná",
    "Tena",
    "San Lorenzo",
    "Catamayo",
    "El Guabo",
    "Pedernales",
    "Atuntaqui",
    "Bahía de Caráquez",
    "Pedro Carbo",
    "Macas",
    "Yaguachi",
    "Calceta",
    "Arenillas",
    "Jaramijó",
    "Valencia",
    "Machachi",
    "Shushufindi",
    "Atacames",
    "Piñas",
    "San Gabriel",
    "Gualaceo",
    "Lomas de Sargentillo",
    "Cañar",
    "Cariamanga",
    "Baños de Agua Santa",
    "Montalvo",
    "Macará",
    "San Miguel de Salcedo",
    "Zamora",
    "Puerto Ayora",
    "La Joya de los Sachas",
    "Salitre",
    "Tosagua",
    "Pelileo",
    "Pujilí",
    "Tabacundo",
    "Puerto López",
    "San Vicente",
    "Santa Ana",
    "Zaruma",
    "Balao",
    "Rocafuerte",
    "Yantzaza",
    "Cotacachi",
    "Santa Lucía",
    "Cumandá",
    "Palestina",
    "Alfredo Baquerizo Moreno",
    "Nobol",
    "Mocache",
    "Puebloviejo",
    "Portovelo",
    "Sucúa",
    "Guano",
    "Píllaro",
    "Simón Bolívar",
    "Gualaquiza",
    "Paute",
    "Saquisilí",
    "Cnel. Marcelino Maridueña",
    "Paján",
    "San Miguel",
    "Puerto Baquerizo Moreno",
    "Catacocha",
    "Palenque",
    "Alausí",
    "Caluma",
    "Catarama",
    "Flavio Alfaro",
    "Colimes",
    "Echeandía",
    "Jama",
    "Gral. Antonio Elizalde (Bucay)",
    "Isidro Ayora",
    "Muisne",
    "Santa Isabel",
    "Pedro Vicente Maldonado",
    "Biblián",
    "Archidona",
    "Junín",
    "Baba",
    "Valdez (Limones)",
    "Pimampiro",
    "Camilo Ponce Enríquez",
    "San Miguel de Los Bancos",
    "El Tambo",
    "Quinsaloma",
    "El Ángel",
    "Alamor",
    "Chambo",
    "Chimbo",
    "Celica",
    "Chordeleg",
    "Balsas",
    "Saraguro",
    "El Chaco",
    "Girón",
    "Huaca",
    "Pichincha",
    "Chunchi",
    "Pallatanga",
    "Marcabelí",
    "Sígsig",
    "Gral. Leonidas Plaza Gutiérrez (Limón)",
    "Urcuquí",
    "Loreto",
    "Rioverde",
    "Zumba",
    "Palora",
    "Mira",
    "El Pangui",
    "Puerto Quito",
    "Bolívar",
    "Sucre",
    "Chillanes",
    "Quero",
    "Guamote",
    "Cevallos",
    "Zapotillo",
    "Villa La Unión (Cajabamba)",
    "Santiago de Méndez",
    "Zumbi",
    "Puerto El Carmen de Putumayo",
    "Patate",
    "Olmedo",
    "Puerto Villamil",
    "El Dorado de Cascales",
    "Lumbaqui",
    "Palanda",
    "Sigchos",
    "Pindal",
    "Guayzimi",
    "Baeza",
    "El Corazón",
    "Paccha",
    "Amaluza",
    "Las Naves",
    "Logroño",
    "San Fernando",
    "Gonzanamá",
    "San Juan Bosco",
    "Yacuambi",
    "Santa Clara",
    "Arajuno",
    "Tarapoa",
    "Tisaleo",
    "Suscal",
    "Nabón",
    "Mocha",
    "La Victoria",
    "Guachapala",
    "Santiago",
    "Chaguarpamba",
    "Penipe",
    "Taisha",
    "Chilla",
    "Paquisha",
    "Carlos Julio Arosemena Tola",
    "Sozoranga",
    "Pucará",
    "Huamboya",
    "Quilanga",
    "Oña",
    "Sevilla de Oro",
    "Mera",
    "Pablo Sexto",
    "Olmedo",
    "Déleg",
    "La Bonita",
    "El Pan",
    "Tiputini",
  ];

  const defaultValues: newUSer = {
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
    phone: "",
    address: "",
    bornDate: "",
    cc: "",
    city: "",
    country: "Ecuador",
    isActive: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<newUSer>({ defaultValues });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const newUser = {
      ...defaultValues,
      ...data,
    };
    console.debug(newUser);
    // return
    await signUp(newUser);
    setIsLoading(false);
    reset();
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-lg h-screen sm:h-auto sm:max-h-[calc(100vh-2rem)] flex flex-col safe-area-inset">
      {/* Header fijo */}
      <div className="p-4 sm:p-6 flex-shrink-0 border-b border-gray-100 sm:border-b-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Registro de Nuevo Usuario</h1>
      </div>
      
      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:overflow-visible">
        {!isLoading ? (
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pb-6 sm:pb-0" onSubmit={onSubmit}>
          {/** Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              {...register("name", { required: "El nombre es obligatorio 👀" })}
              type="text"
              id="name"
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/** CC */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cédula de Ciudadanía</label>
            <input
              {...register("cc", {
                required: "El nro de cc es obligatorio 👀",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Sólo se permiten números entre 0 y 9 ",
                },
              })}
              type="text"
              inputMode="numeric"
              maxLength={13}
              placeholder="10123000009"
              id="cc"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.cc && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.cc.message}
              </p>
            )}
          </div>

          {/** Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", { required: "El email es obligatorio 👀" })}
              type="email"
              inputMode="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/** Ciudad*/}
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <select
              {...register("city", { required: "Ciudad" })}
              id="city"
              defaultValue={""}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 bg-white text-base appearance-none touch-manipulation"
            >
              <option value={""}>Seleccione ciudad</option>
              {cities.map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city}
                  </option>
                );
              })}
            </select>
            {errors.city && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                La ciudad es obligatoria
              </p>
            )}
          </div>

          {/** Password*/}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              {...register("password", {
                required: "La contraseña es obligatoria 👀",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/** Password2*/}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              {...register("password2", {
                required: "Debe repetir la contraseña  👀",
                validate: (value) =>
                  value === getValues("password") ||
                  "Las contraseñas no coinciden",
              })}
              type="password"
              id="password2"
              placeholder="Confirme su contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.password2 && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.password2.message}
              </p>
            )}
          </div>

          {/** Telefono*/}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              {...register("phone", {
                required: "El teléfono es obligatorio 👀",
              })}
              type="tel"
              inputMode="tel"
              id="phone"
              placeholder="Ej. 0987654321"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/** Dirección*/}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              {...register("address", {
                required: "La dirección es obligatoria 👀",
              })}
              type="text"
              id="address"
              placeholder="Ej. Av. Principal 123"
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
            {errors.address && (
              <p className="text-red-500 text-xs italic flex items-center gap-1">
                <span>⚠️</span>
                {errors.address.message}
              </p>
            )}
          </div>

          {/** BornDate*/}
          <div className="space-y-2 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Fecha de cumpleaños</span>
              <span>🎂</span>
            </label>
            <input 
              {...register("bornDate")}
              type="date" 
              name="bornDate" 
              className="w-full sm:w-1/2 lg:w-1/3 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base touch-manipulation"
            />
          </div>

          {/** Buttons*/}
          <div className="lg:col-span-2 space-y-4 pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center justify-center gap-2 text-base min-h-[48px] touch-manipulation"
            >
              <span>Registrarme</span>
              <span>🤘🏻</span>
            </button>
            <div className="text-center">
              <a 
                href="/auth/signin" 
                className="inline-flex items-center justify-center w-full py-4 px-6 border-2 border-blue-500 text-blue-600 font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out gap-2 text-base min-h-[48px] touch-manipulation"
              >
                <span className="hidden sm:inline">¿Ya eres estudiante? Continúa por aquí</span>
                <span className="sm:hidden">¿Ya tienes cuenta? Inicia sesión</span>
                <span>✅</span>
              </a>
            </div>
          </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg p-6">
            <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
              <Loading />
            </div>
            <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
              Procesando registro...
            </h1>
            <p className="text-gray-600 text-center text-sm">
              Por favor espera mientras creamos tu cuenta
            </p>
            <div className="mt-4 flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
