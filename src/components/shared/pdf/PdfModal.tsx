import { FC, useEffect, useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { ModalGeneric } from '../ui/ModalGeneric';
import { Loading } from '../ui/Loading';


interface Props {
    title: string;
    src: string;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
    errorMsg?: string;
}

export const PdfModal: FC<Props> = ({ title, src, isVisible, setIsVisible, errorMsg = 'Este producto no tiene ficha técnica' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [pdfFileUrl, setPdfFileUrl] = useState('');
    const defaultLayoutPluginInstance = defaultLayoutPlugin({

    });

    useEffect(() => {
        setIsLoading(true);
        setPdfFileUrl(src);
        setIsLoading(false);

    }, [src, isVisible, errorMsg])


    return (
        <>
            <ModalGeneric title={title} isVisible={isVisible} setIsVisible={setIsVisible} children={
                <>
                    {
                        isLoading
                            ? <Loading />
                            : <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={pdfFileUrl}
                                    plugins={[defaultLayoutPluginInstance]}
                                    theme={'dark'}
                                />
                            </Worker>}
                </>} />
        </>
    )
}
