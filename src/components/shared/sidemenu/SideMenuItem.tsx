import { useState } from "react";
import { IconType } from "react-icons";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useSubLevelStore } from "../../../stores";

interface Props {
  href: string;
  Icon: IconType;
  title: string;
  subTitle: string;
  expanded?: boolean;
}

export const SideMenuItem = ({
  href,
  Icon,
  title,
  subTitle,
  expanded = false,
}: Props) => {
  const [hasOpen, setHasOpen] = useState(false);
  const units = useSubLevelStore((state) => state.subLevels);

  return (
    <NavLink key={href} to={href} end>
      <div>
        <Icon />
      </div>
      <div className="flex flex-col" onClick={() => setHasOpen(!hasOpen)}>
        <span className="text-lg font-bold leading-5 text-white">{title}</span>
        <div className="flex flex-row justify-between">
          <span className="text-sm text-white/50 hidden md:block">
            {subTitle}
          </span>
          {expanded && (
            <div className="pl-5">
              {hasOpen ? <IoChevronDown /> : <IoChevronForward />}
              <div className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                {hasOpen && (
                  <ul id="dropdown-example" className=" py-2 space-y-2">
                    {hasOpen &&
                      units.map((item) => (
                        <li
                          className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          key={item.id}
                        >
                          {item.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </NavLink>
  );
};
