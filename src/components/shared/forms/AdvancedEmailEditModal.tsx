import { FC, useState } from 'react';
import { FirestoreUser } from '../../../interface';
import { Loading } from '../ui/Loading';
import { IoMail, IoWarning } from 'react-icons/io5';

interface Props {
    isOpen: boolean;
    user: FirestoreUser;
    onClose: () => void;
    onConfirm: (newEmail: string, onProgress: (step: string, progress: number) => void) => Promise<void>;
}

export const AdvancedEmailEditModal: FC<Props> = ({ isOpen, user, onClose, onConfirm }) => {
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!newEmail || !confirmEmail) {
            setError('Por favor, complete ambos campos');
            return;
        }

        if (newEmail !== confirmEmail) {
            setError('Los emails no coinciden');
            return;
        }

        if (!validateEmail(newEmail)) {
            setError('El formato del email no es válido');
            return;
        }

        if (newEmail === user.email) {
            setError('El nuevo email es igual al actual');
            return;
        }

        setIsProcessing(true);
        setCurrentStep('Iniciando migración...');
        setProgress(0);

        try {
            const handleProgress = (step: string, progressValue: number) => {
                setCurrentStep(step);
                setProgress(progressValue);
            };

            await onConfirm(newEmail, handleProgress);
            // El modal se cerrará desde el componente padre después del éxito
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el email';
            setError(errorMessage);
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (isProcessing) return; // No permitir cerrar durante el proceso
        setNewEmail('');
        setConfirmEmail('');
        setError('');
        setCurrentStep('');
        setProgress(0);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <IoWarning className="text-3xl" />
                        <div>
                            <h2 className="text-2xl font-bold">Edición Avanzada de Email</h2>
                            <p className="text-sm opacity-90 mt-1">
                                Esta operación creará una nueva cuenta para el usuario
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!isProcessing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Usuario actual */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Usuario Actual</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Nombre:</span> {user.name}</p>
                                    <p><span className="font-medium">Email actual:</span> {user.email}</p>
                                    <p><span className="font-medium">ID:</span> {user.id}</p>
                                </div>
                            </div>

                            {/* Advertencia */}
                            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <IoWarning className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-yellow-800 space-y-2">
                                        <p className="font-semibold">⚠️ Importante: Esta operación realizará lo siguiente:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Creará una nueva cuenta de autenticación con el nuevo email</li>
                                            <li>La contraseña temporal será la cédula del usuario o "estudiante@gateway.corp"</li>
                                            <li>Actualizará todas las referencias del usuario en las colecciones:
                                                <ul className="list-disc list-inside ml-4 mt-1">
                                                    <li>Usuarios (users)</li>
                                                    <li>Hojas de progreso (progress-sheet)</li>
                                                    <li>Eventos (events)</li>
                                                </ul>
                                            </li>
                                            <li>El usuario deberá usar el nuevo email para iniciar sesión</li>
                                            <li>La contraseña temporal es: <strong>{user.cc || 'estudiante@gateway.corp'}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Nuevo Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <IoMail className="inline mr-2" />
                                    Nuevo Email
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="nuevo@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                                    disabled={isProcessing}
                                    required
                                />
                            </div>

                            {/* Confirmar Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <IoMail className="inline mr-2" />
                                    Confirmar Nuevo Email
                                </label>
                                <input
                                    type="email"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    placeholder="nuevo@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                                    disabled={isProcessing}
                                    required
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                    <p className="text-red-800 text-sm flex items-center gap-2">
                                        <IoWarning />
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isProcessing}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-md hover:from-orange-600 hover:to-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <IoMail />
                                    Migrar Usuario
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Loading State */
                        <div className="py-12">
                            <Loading 
                                h="16" 
                                w="16" 
                                borderColor="orange"
                                message={currentStep}
                            />
                            
                            {/* Barra de progreso */}
                            <div className="mt-8 space-y-3">
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-center text-sm text-gray-600">
                                    {progress}% completado
                                </p>
                            </div>

                            {/* Pasos del proceso */}
                            <div className="mt-8 space-y-2 text-sm text-gray-600">
                                <p className={progress >= 10 ? 'text-green-600 font-medium' : ''}>
                                    ✓ Preparando migración
                                </p>
                                <p className={progress >= 20 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 20 ? '✓' : '○'} Creando cuenta de autenticación
                                </p>
                                <p className={progress >= 30 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 30 ? '✓' : '○'} Actualizando perfil
                                </p>
                                <p className={progress >= 40 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 40 ? '✓' : '○'} Creando registro de usuario
                                </p>
                                <p className={progress >= 50 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 50 ? '✓' : '○'} Actualizando hojas de progreso
                                </p>
                                <p className={progress >= 70 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 70 ? '✓' : '○'} Actualizando eventos
                                </p>
                                <p className={progress >= 90 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 90 ? '✓' : '○'} Eliminando datos antiguos
                                </p>
                                <p className={progress >= 100 ? 'text-green-600 font-medium' : ''}>
                                    {progress >= 100 ? '✓' : '○'} Finalizado
                                </p>
                            </div>

                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800 text-center">
                                    Por favor, no cierre esta ventana. El proceso puede tomar varios minutos.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
