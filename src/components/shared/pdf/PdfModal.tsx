import { FC } from 'react'
import { ModalGeneric } from '../ui/ModalGeneric';

interface Props {
    title: string;
    src: string;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
    errorMsg?: string;
}

export const PdfModal: FC<Props> = ({ title, src, isVisible, setIsVisible, errorMsg = 'Este Libro no tiene un archivo valido' }) => {
    return (
        <ModalGeneric 
            title={title} 
            isVisible={isVisible} 
            setIsVisible={setIsVisible}
            children={
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-600 mb-4">Funcionalidad de visualización de PDF temporalmente deshabilitada</p>
                    <p className="text-sm text-gray-500">{errorMsg}</p>
                    {src && (
                        <a 
                            href={src} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Abrir PDF en nueva ventana
                        </a>
                    )}
                </div>
            } 
        />
    )
}
