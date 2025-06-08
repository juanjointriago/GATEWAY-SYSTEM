import { FC, useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import { useAuthStore } from "../../../stores";
import { menuItemsByRole } from "./menu";
import { IoIosArrowBack } from "react-icons/io";
import { RiMenu4Fill } from "react-icons/ri";

export const SideBar: FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const user = useAuthStore(state => state.user);

    const toggleSidebar = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            {/* Botón hamburguesa móvil */}
            <button 
                className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
                onClick={toggleSidebar}
            >
                <RiMenu4Fill size={24} />
            </button>

            {/* Overlay para móvil */}
            {isOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-0 left-0 h-full bg-white 
                    shadow-xl z-50 transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isOpen ? 'w-64' : 'w-20 lg:w-20'} 
                    lg:relative lg:block
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <h4 className={`text-lg font-medium transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                        Menu
                    </h4>
                </div>

                {/* Toggle button para desktop */}
                <button 
                    onClick={toggleSidebar}
                    className={`
                        hidden lg:flex absolute -right-3 top-20
                        w-6 h-6 bg-gray-800 text-white
                        rounded-full items-center justify-center
                        transform transition-transform duration-300
                        ${isOpen ? 'rotate-0' : 'rotate-180'}
                    `}
                >
                    <IoIosArrowBack size={14} />
                </button>

                {/* Menu Items */}
                <nav className="mt-6">
                    <div className="px-3 space-y-1">
                        {user && menuItemsByRole(user.role).map((item) => (
                            <SideMenuItem 
                                key={item.title} 
                                {...item} 
                                isExpanded={isOpen}
                            />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};
