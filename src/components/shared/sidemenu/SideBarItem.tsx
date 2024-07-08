import { FC } from "react"
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";




interface Props {
    Icon: IconType,
    text: string,
    // alert:'', 
    expanded: boolean;
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    href: string
}
export const SideBarItem: FC<Props> = ({ Icon, text, expanded, href }) => {
    const colorClass = href ? "text-white" : "text-white/50 hover:text-white";
    return (
        <NavLink key={href} to={href} end>
            {/* <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}> */}
            <li className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}>
                <div className="text-xl flex [&>*]:mx-auto w-[30px]"><Icon /></div>
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
                    <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                        {text}
                    </div>
            </li>
        </NavLink>
    )
}
