import { FC, useState, useEffect } from "react";
import { ModalGeneric } from "../ui/ModalGeneric";
import { Loading } from "../ui/Loading";

interface Props {
    title: string;
    src: string;
    errorMsg?: string;
}

export const UrlIframe: FC<Props> = ({ title, src, errorMsg = 'Este producto no tiene ficha técnica' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [pdfFileUrl, setPdfFileUrl] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const urlWithoutToolbar = src.includes('#') ? src : `${src}#toolbar=0&zoom=page-fit`;
        setPdfFileUrl(urlWithoutToolbar);
        setIsLoading(false);
    }, [src]);

    return (
        <>
            {/* Botón responsive */}
            <button 
                className="w-full sm:w-auto bg-transparent hover:bg-blue-500 
                text-blue-700 font-semibold hover:text-white 
                py-2 px-4 border border-blue-500 
                hover:border-transparent rounded
                transition-all duration-300 ease-in-out
                flex items-center justify-center gap-2
                text-sm sm:text-base"
                onClick={() => setIsVisible(true)}
            >
                <span className="text-lg">🔍</span>
                <span>Support Material</span>
            </button>

            {/* Modal con contenido responsive */}
            <ModalGeneric 
                title={title} 
                isVisible={isVisible} 
                setIsVisible={setIsVisible}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <Loading />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                        <div className="relative w-full h-full">
                            <iframe 
                                src={pdfFileUrl}
                                className="w-full h-[calc(50vh)] sm:h-[calc(60vh)] md:h-[calc(70vh)] lg:h-[calc(80vh)]"
                                style={{
                                    minHeight: '300px',
                                    maxHeight: 'calc(90vh - 10rem)'
                                }}
                                frameBorder="0"
                                title={title}
                                allowFullScreen
                                loading="lazy"
                            />
                            
                            {/* Error message */}
                            {!src && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                    <p className="text-gray-500 text-sm sm:text-base text-center px-4">
                                        {errorMsg}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ModalGeneric>
        </>
    );
};
