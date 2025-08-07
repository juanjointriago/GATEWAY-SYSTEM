/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

export const SignInForm = () => {
    const navigate = useNavigate();
    const loginUser = useAuthStore(state => state.loginUser);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ email: string; password: string }>();

    const [authError, setAuthError] = useState<string | null>(null);
    const onSubmit = async (data: { email: string; password: string }) => {
        setAuthError(null);
        try {
            await loginUser(data.email, data.password);
            navigate('/dashboard');
        } catch (error: any) {
            setAuthError(error?.message || 'Credenciales incorrectas. Intenta nuevamente.');
            toast.error('Credenciales incorrectas. Intenta nuevamente.', {
                description: 'Error de autenticación',
                duration: 3500,
            });
        }
    }

    return (
        <>
            <h1 className="font-semibold mb-4 ">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: 'El email es obligatorio', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Email inválido' } })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition duration-200 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent transition duration-200 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                </div>
                <div className="mb-4 text-blue-500">
                    <a href="/auth/forgot-password" className="hover:underline">Contraseña olvidada?</a>
                </div>
                <button type="submit" className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">Iniciar Sesión , estudiante ya registrado🤘🏻</button>
                {authError && (
                    <div className="text-red-500 text-xs mt-2 text-center">{authError}</div>
                )}
            </form>
            <div className="mt-5 mb-5 sm:px-0 mx-auto">
                <button className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2">
                    <a href="/auth/signup">Eres nuevo en la plataforma? Registrate aquí 📝</a>
                </button>
            </div>
        </>
    );
}
