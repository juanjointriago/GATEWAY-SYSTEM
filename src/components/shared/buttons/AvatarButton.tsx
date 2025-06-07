import { FC } from "react";
import { TootipBase } from "./TootipBase";

interface Props {
    isActive: boolean;
    action?: () => void;
    color?: string;
    tootTipText?: string
    initialLetter?: string
    textColor?:string
}

/**
 * 
 * @param param0 
 * @description this component return a tootip element for show initial letters
 * @returns 
 */
export const AvatarButton: FC<Props> = ({ isActive, action = () => console.debug('Press AvatarButton'), tootTipText, initialLetter = 'AB', color = 'gray-500', textColor = 'text-gray-100' }) => {
   
    return (
        <>
            {isActive && <>
                <TootipBase title={''} tootTipText={tootTipText}>
                    <div onClick={action} className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-${color} rounded-full`}>
                        <span className={`font-medium ${textColor}`}>{initialLetter}</span>
                    </div>
                </TootipBase>
            </>

            }
        </>
    )
}
