import { FC, useState } from "react";

interface Props {
    isActive: boolean;
    action: () => void;

}
export const CheckBox: FC<Props> = ({ isActive, action }) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            {isLoading
                ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                : <input type="checkbox" checked={isActive} onChange={() => {
                    setIsLoading(true);
                    action();
                    setIsLoading(false)
                }} />}
        </>
    )
}
