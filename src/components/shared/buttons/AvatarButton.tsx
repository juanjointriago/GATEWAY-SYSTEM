import { FC } from "react";
import { TootipBase } from "./TootipBase";

interface Props {
    isActive: boolean;
    action?: () => void;
    color?: string;
    tootTipText?: string
    initialLetter?:string
}
// `${tootTipText?.split(" ")[0][0].toUpperCase()}${tootTipText?.split(" ")[1][0].toUpperCase()}`

export const AvatarButton: FC<Props> = ({ isActive, action = ()=>console.log('Press AvatarButton'), tootTipText, initialLetter = 'AB'}) => {
    return (
        <>
            {isActive && <>
                <TootipBase title={''} tootTipText={`${tootTipText}`}>
                    <div onClick={action} className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{initialLetter}</span>
                    </div>
                </TootipBase>
            </>

            }
        </>
    )
}
