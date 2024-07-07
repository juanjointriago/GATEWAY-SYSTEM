import { FC, useState, useEffect } from "react";
import { ModalGeneric } from "../ui/ModalGeneric";
import { Loading } from "../ui/Loading";

interface Props {
    title: string;
    src: string;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
    errorMsg?: string;
}
export const UrlIframe: FC<Props> = ({ title, src, isVisible, setIsVisible, errorMsg = 'Este producto no tiene ficha técnica' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [pdfFileUrl, setPdfFileUrl] = useState('');

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
                            : <div>
                                {<iframe src={pdfFileUrl}  className="w-[100%] h-[27rem]"></iframe>}
                            </div>}
                </>} />

        </>
    )
}
