import { FC } from "react"
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";




interface Props {
    Icon: IconType,
    text: string,
    subtitle?: string
    expanded: boolean;
    href: string
}
export const SideBarItem: FC<Props> = ({ Icon, text, subtitle, expanded, href }) => {
    return (
        <NavLink
            to={href}
            className={`flex items-center p-4 ${expanded ? 'bg-gray-100' : ''}`}
        >
            <Icon className="mr-4 text-2xl" />
            <div className="flex-1">
                <h5 className="text-base font-medium">{text}</h5>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </NavLink>
    )
}
