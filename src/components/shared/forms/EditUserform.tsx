import { FC, useState, useEffect } from "react"
import { FirestoreUser } from "../../../interface"
import { useForm } from "react-hook-form";
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import CustomModal from "../../../components/CustomModal";



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
    
    // Inicializar estados con valores actuales del usuario
    const [levelStudent, setLevelStudent] = useState<string>(user.level || '');
    const [selectedSublevels, setSelectedSublevels] = useState<{value: string, label: string} | null>(null);
    
    // Efecto para inicializar sublevels cuando estén disponibles
    useEffect(() => {
        if (user.subLevel && sublevels.length > 0) {
            const sublevel = sublevels.find(s => s.id === user.subLevel);
            if (sublevel) {
                setSelectedSublevels({ value: user.subLevel, label: sublevel.name });
            }
        }
    }, [user.subLevel, sublevels]);

    // Función para validar cédula ecuatoriana
    const validateEcuadorianID = (cc: string): boolean => {
        if (cc.length !== 10) return false;
        
        const digits = cc.split('').map(Number);
        const province = parseInt(cc.substring(0, 2));
        
        // Validar provincia (01-24, excepto 00)
        if (province < 1 || province > 24) return false;
        
        // Algoritmo de validación
        const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let sum = 0;
        
        for (let i = 0; i < 9; i++) {
            let result = digits[i] * coefficients[i];
            if (result > 9) result -= 9;
            sum += result;
        }
        
        const verification = sum % 10 === 0 ? 0 : 10 - (sum % 10);
        return verification === digits[9];
    };



    const cities = [
        'Guayaquil',
        'Quito',
        'Cuenca',
        'Santo Domingo',
        'Machala',
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
    console.debug('EditUserForm Found User by id', { user });
    

    // Estados para CustomModal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>("info");
    const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});
    const [modalCancelable, setModalCancelable] = useState<boolean>(false);

    // Inicializar formulario con valores por defecto
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FirestoreUser>({ 
        defaultValues: {
            ...user,
            updatedAt: Date.now()
        }
    });

    const showModal = (title: string, message: string, type: 'warn' | 'info' | 'danger' | 'success', action?: () => Promise<void> | void, cancelable = false) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setModalAction(() => action || (() => setModalOpen(false)));
        setModalCancelable(cancelable);
        setModalOpen(true);
    };

    const onSubmit = handleSubmit(async (data) => {
        // Validar que si es estudiante, debe tener modalidad
        if (data.role === 'student' && !levelStudent) {
            showModal('Error de validación', 'Debe seleccionar una modalidad para el estudiante', 'danger');
            return;
        }
        // Validar que si es estudiante, debe tener sublevel
        if (data.role === 'student' && !selectedSublevels) {
            showModal('Error de validación', 'Debe seleccionar un curso para el estudiante', 'danger');
            return;
        }
        // Validar cédula ecuatoriana
        if (data.cc && !validateEcuadorianID(data.cc)) {
            showModal('Cédula inválida', 'La cédula ingresada no es válida según el algoritmo ecuatoriano', 'danger');
            return;
        }
        // Asignar valores específicos para estudiantes
        const updatedData = { ...data };
        if (data.role === 'student') {
            updatedData.level = levelStudent;
            updatedData.subLevel = selectedSublevels?.value || '';
        } else {
            updatedData.level = '';
            updatedData.subLevel = '';
        }
        const updatedUser = {
            ...user,
            ...updatedData,
            updatedAt: Date.now()
        };
        showModal(
            '¿Estás seguro?',
            `Estás a punto de actualizar los datos de ${user.name}`,
            'warn',
            async () => {
                setModalOpen(false);
                try {
                    await updateUser(updatedUser);
                    showModal('¡Actualizado!', 'Los datos del usuario han sido actualizados correctamente.', 'success');
                } catch (error) {
                    console.error('Error actualizando usuario:', error);
                    showModal('Error', 'Hubo un problema al actualizar los datos. Inténtalo de nuevo.', 'danger');
                }
            },
            true
        );
    });

    // Ya no se necesita handleConfirmUpdate ni pendingUser

    console.debug('👀', watch('role'));
    return (
        <>
            <CustomModal
                isOpen={modalOpen}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onConfirm={modalAction}
                onCancel={modalCancelable ? () => setModalOpen(false) : undefined}
            />
            <div className="w-full max-w-none">
                <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6" onSubmit={onSubmit}>
                {/** Name */}
                <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input
                        {...register("name", { required: "El nombre es obligatorio 👀", })}
                        type="text"
                        id="name"
                        placeholder='Ej. Juan Pérez'
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                    />
                    {errors.name && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.name.message}
                    </p>}
                </div>

                {/** CC */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Cédula de Ciudadanía</label>
                    <input
                        {...register("cc", { 
                            required: "La cédula es obligatoria", 
                            pattern: { 
                                value: /^[0-9]{10}$/, 
                                message: 'La cédula debe tener exactamente 10 dígitos' 
                            },
                            validate: (value) => {
                                if (value && !validateEcuadorianID(value)) {
                                    return 'La cédula no es válida según el algoritmo ecuatoriano';
                                }
                                return true;
                            }
                        })}
                        type="text"
                        maxLength={10}
                        placeholder='1234567890'
                        id="cc"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                    />
                    {errors.cc && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.cc.message}
                    </p>}
                </div>

                {/** Ciudad*/}
                <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <select
                        {...register("city", { required: "La ciudad es obligatoria" })}
                        id="city"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 bg-white text-base"
                    >
                        <option value=''>Seleccione ciudad</option>
                        {
                            cities.map((city, index) => {
                                return <option key={index} value={city}>{city}</option>
                            })
                        }
                    </select>
                    {errors.city && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.city.message}
                    </p>}
                </div>

                {/** Email */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        {...register("email", { 
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "El formato del email no es válido"
                            }
                        })}
                        type="email"
                        id="email"
                        placeholder="ejemplo@correo.com"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                    />
                    {errors.email && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.email.message}
                    </p>}
                </div>

                {/*Role*/}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <select
                        {...register("role", { required: "Debe seleccionar un rol" })}
                        id="role"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 bg-white text-base"
                    >
                        <option value=''>Seleccione Rol</option>
                        {
                            roles.map((role, index) => {
                                return <option key={index} value={role.value}>{role.label}</option>
                            })
                        }
                    </select>
                    {errors.role && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.role.message}
                    </p>}
                </div>

                {/*Level and SubLevel for Students*/}
                {watch('role') === 'student' && (
                    <>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Modalidad</label>
                            <div className="relative">
                                <Select
                                    components={animatedComponents}
                                    placeholder="Seleccione modalidad"
                                    value={levelStudent ? { value: levelStudent, label: levels.find(level => level.id === levelStudent)?.name || '' } : null}
                                    options={levels.filter(level => level.id).map(level => ({ value: level.id!, label: level.name }))}
                                    onChange={(selectedOption) => {
                                        console.debug('LEVELID', selectedOption);
                                        const option = selectedOption as {value: string, label: string} | null;
                                        setLevelStudent(option?.value || '');
                                        // Limpiar sublevel cuando cambie el level
                                        setSelectedSublevels(null);
                                    }}
                                    isClearable
                                    className="text-base"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '42px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            '&:hover': {
                                                borderColor: '#9ca3af'
                                            },
                                            '&:focus-within': {
                                                borderColor: '#3b82f6',
                                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Curso</label>
                            <div className="relative">
                                <Select
                                    id="sublevels"
                                    components={animatedComponents}
                                    value={selectedSublevels}
                                    placeholder="Seleccione curso"
                                    options={sublevels.filter(sublevel => sublevel.id).map(sublevel => ({ value: sublevel.id!, label: sublevel.name }))}
                                    onChange={(selectedOption) => {
                                        console.debug('SUB-LEVELID', { selectedOption });
                                        const option = selectedOption as {value: string, label: string} | null;
                                        setSelectedSublevels(option);
                                    }}
                                    isClearable
                                    className="text-base"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '42px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            '&:hover': {
                                                borderColor: '#9ca3af'
                                            },
                                            '&:focus-within': {
                                                borderColor: '#3b82f6',
                                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/** Teacher Link for Teachers */}
                {watch('role') === 'teacher' && (
                    <div className="lg:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Teacher Link</label>
                        <input
                            {...register("teacherLink")}
                            type="text"
                            id="teacherLink"
                            placeholder="https://teacher-link.com"
                            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                        />
                    </div>
                )}

                {/** Dirección*/}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                        {...register("address", { required: "La dirección es obligatoria 👀" })}
                        type="text"
                        id="address"
                        placeholder="Ej. Av. Principal 123"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                    />
                    {errors.address && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.address.message}
                    </p>}
                </div>

                {/** Telefono*/}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
                    <input
                        {...register("phone", { 
                            required: "El teléfono es obligatorio",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "El teléfono debe tener exactamente 10 dígitos"
                            }
                        })}
                        type="tel"
                        id="phone"
                        maxLength={10}
                        placeholder="Ej. 0987654321"
                        className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:border-gray-400 text-base"
                    />
                    {errors.phone && <p className="text-red-500 text-xs italic flex items-center gap-1">
                        <span>⚠️</span>
                        {errors.phone.message}
                    </p>}
                </div>

                {/** Buttons */}
                <div className="lg:col-span-2 space-y-3 pt-4 border-t border-gray-200">
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-base"
                    >
                        <span>Guardar Cambios</span>
                        <span>🤘🏻</span>
                    </button>
                    
                    <button
                        type="button"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                        onClick={() => {
                            console.log('enviando correo para reinicio de contraseña');
                            console.log('user.email', user.email);
                            resetPasswordByEmail(user.email)}}
                    >
                        <span>Enviar correo para reinicio de contraseña</span>
                        <span>🔑</span>
                    </button>
                </div>
            </form>
        </div>
    </>
    )
}
