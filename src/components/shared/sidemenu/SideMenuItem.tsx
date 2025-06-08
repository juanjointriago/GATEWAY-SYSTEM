import { FC } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface Props {
  href: string;
  Icon: IconType;
  title: string;
  subTitle: string;
  expanded?: boolean;
}

export const SideMenuItem: FC<Props> = ({
  href,
  Icon,
  title,
  expanded = false,
}) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => `
        flex ${expanded ? 'flex-row items-center gap-4' : 'flex-col items-center gap-1'} 
        ${expanded ? 'px-4' : 'px-2'} py-3 rounded-lg
        transition-all duration-200 group
        ${isActive
          ? "bg-indigo-800 text-white"
          : "text-gray-300 hover:bg-indigo-800/50 hover:text-white"
        }
      `}
    >
      <div className={`
        flex items-center justify-center
        ${expanded ? 'min-w-[24px]' : ''}
      `}>
        <Icon size={20} />
      </div>
      <span className={`
        ${expanded ? 'text-sm' : 'text-[10px]'} 
        ${expanded ? '' : 'text-center'} 
        leading-tight transition-all duration-300
        ${(!expanded) ? 'opacity-0 h-0' : 'opacity-100 h-auto'}
      `}>
        {title}
      </span>
    </NavLink>
  );
};
