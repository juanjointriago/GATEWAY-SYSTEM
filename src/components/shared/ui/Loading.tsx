import { FC } from "react"

interface Props{
    h?: string;
    w?: string;
    borderColor?: string;
    fullScreen?: boolean;
    message?: string;
}

export const Loading: FC<Props> = ({ 
    h = '12', 
    w = '12', 
    borderColor = 'blue',
    fullScreen = false,
    message = 'Cargando...'
}) => {
    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`
                rounded-full h-${h} w-${w} 
                border-4 border-t-4 border-gray-200 
                border-t-${borderColor}-600 
                animate-spin
            `}></div>
            {message && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
}
