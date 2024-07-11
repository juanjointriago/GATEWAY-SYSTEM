import { FC } from "react";
import { IconType } from "react-icons";



interface Props {
    isActive: boolean;
    action: () => void;
    Icon: IconType;
    iconSize?: number;
    color?: string;
    tootTipText?: string
}

export const FabButton: FC<Props> = ({ isActive, action, Icon, iconSize = 20, color = 'white', tootTipText }) => {
    return (
        <>
            {isActive && <>
                <div onClick={action} className="group relative m-1 inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-indigo-600">
                    <Icon className="" color={color} size={iconSize} />
                    {tootTipText && <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                        {tootTipText} ✨
                    </span>}
                </div>
            </>

            }
        </>
    )
}
