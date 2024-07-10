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
    const [isVisible, setIsVisible] = useState(false)
    const [pdfFileUrl, setPdfFileUrl] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setPdfFileUrl(src);
        setIsLoading(false);
    }, [src, isVisible, errorMsg])


    return (
        <>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => setIsVisible(true)}>🔍 Support Material</button>
            <ModalGeneric title={title} isVisible={isVisible} setIsVisible={setIsVisible} children={
                <>
                    {
                        isLoading
                            ? <Loading />
                            : <div>
                                {<iframe src={pdfFileUrl}  className="w-[100%] h-[27rem]"></iframe>}
                            </div>}
                </>} />

        </>
    )
}
