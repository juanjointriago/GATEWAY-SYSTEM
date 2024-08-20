import { FC } from "react";
import { TootipBase } from "./TootipBase";

interface Props {
    isActive: boolean;
    action?: () => void;
    color?: string;
    tootTipText?: string
    initialLetter?: string
}

export const AvatarButton: FC<Props> = ({ isActive, action = () => console.log('Press AvatarButton'), tootTipText, initialLetter = 'AB', color = 'gray-500' }) => {
   
    return (
        <>
            {isActive && <div>
                <TootipBase title={''} tootTipText={tootTipText}>
                    <div onClick={action} className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-${color} rounded-full`}>
                        <span className="font-medium text-gray-100">{initialLetter}</span>
                    </div>
                </TootipBase>
            </div>

            }
        </>
    )
}
