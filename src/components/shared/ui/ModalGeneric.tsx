import { FC, ReactElement, useEffect } from "react"

interface Props {
    isVisible: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
    title?: string
    children?: ReactElement
}

const Nothing = () => {
    return <div>No Content</div>
}

export const ModalGeneric: FC<Props> = ({ 
    isVisible, 
    setIsVisible, 
    title = 'Modal Title', 
    children = <Nothing /> 
}) => {
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if(e.key === 'Escape'){
                setIsVisible(false);
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [setIsVisible])

    return (
        <>
            {isVisible ? (
                <>
                    {/* Overlay con animación */}
                    <div 
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsVisible(false)}
                    />

                    {/* Container del Modal */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
                            {/* Modal */}
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh]">
                                {/* Header */}
                                <div className="bg-white px-4 py-3 sm:px-6 border-b">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                            {title}
                                        </h3>
                                        <button
                                            onClick={() => setIsVisible(false)}
                                            className="rounded-full p-1.5 bg-gray-700 hover:bg-gray-800 transition-colors duration-200"
                                        >
                                            <svg 
                                                className="h-5 w-5 text-white" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M6 18L18 6M6 6l12 12" 
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido con scroll */}
                                <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
                                    <div className="bg-white p-3 sm:p-6">
                                        <div className="space-y-6">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
