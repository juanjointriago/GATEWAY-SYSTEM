import { FC, useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import { useAuthStore } from "../../../stores";
import { menuItemsByRole } from "./menu";



export const SideBar: FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };


    const user = useAuthStore(state => state.user);

    const sidebarClasses = isOpen
        ? 'w-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out'
        : 'w-0 transition-all duration-300 ease-in-out';

    const sidebarIconClasses = isOpen
        ? 'fas fa-times-circle text-2xl'
        : 'fas fa-bars text-2xl';

    return (
        <div className={sidebarClasses}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h4 className="text-lg font-medium">Sidebar</h4>
                <button onClick={toggleSidebar} className="focus:outline-none">
                    <i className={sidebarIconClasses} />
                </button>
            </div>
            <div className="flex flex-col">
                {user && menuItemsByRole(user.role).map((item) => (
                    <SideMenuItem key={item.title} {...item} />
                ))}
            </div>
        </div>
    );
}
