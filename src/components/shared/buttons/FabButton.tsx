import { FC } from "react";
import { IconType } from "react-icons";



interface Props{
    isActive: boolean;
    action: () => void;
    Icon: IconType;
    iconSize?: number;
}

export const FabButton:FC<Props> = ({isActive, action, Icon, iconSize=20}) => {
    return (
        <>
        {isActive && <button
            className={`p-0 ml-2 w-5 h-5 rounded-full hover:bg-indigo-800 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none`}
            onClick={action}>
            <Icon className="" size={iconSize}/>
        </button>}
        </>
    )
}
