import { FC, useState, useEffect } from "react";
import { SideMenuItem } from "./SideMenuItem";
import { useAuthStore, useLevelStore, useSubLevelStore, useUnitStore, useUserStore } from "../../../stores";
import { menuItemsByRole } from "./menu";
import { IoIosArrowBack } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { RiMenu4Line } from "react-icons/ri";
import { useEventStore } from "../../../stores/events/event.store";
import { useFeesStore } from "../../../stores/fees/fess.store";
import { useNewsStore } from "../../../stores/news/news.store";
import { useProgressSheetStore } from "../../../stores/progress-sheet/progresssheet.store";
import { useEnterpriseInfoStore } from "../../../stores/enterpriseinfo/enterpriseinfo.store";

export const SideBar: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logoutUser);

    const getAllEvents = useEventStore(state => state.getAllEvents);
    const getAllUsers = useUserStore(state => state.getAllUsers);
    const getAllLevels = useLevelStore(state => state.getAndSetLevels);
    const getAllSubLevels = useSubLevelStore(state => state.getAndSetSubLevels);
    const getAllUnits = useUnitStore(state => state.getAndSetUnits);
    const getAllFees = useFeesStore(state => state.getAndSetFees);
    const getAllNews = useNewsStore(state => state.getAndSetNews);
    const getAllProgressSheet = useProgressSheetStore(state => state.getAndSetProgressSheets);
    const getEnterpriseInfo = useEnterpriseInfoStore(state => state.getEnterpriseInfo);

    useEffect(() => {
      getAllEvents();
      getAllUsers();
      getAllLevels();
      getAllSubLevels();
      getAllUnits();
      getAllFees();
      getAllNews();
      getAllProgressSheet();
      getEnterpriseInfo();
    }, [getAllEvents, getAllUsers, getAllLevels, getAllSubLevels, getAllUnits, getAllFees, getAllNews, getAllProgressSheet, getEnterpriseInfo])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Z-index ajustado para no sobreponerse a swal2 (z-index swal2: 9999)
    const sidebarZ = isMobile ? 'z-[9998]' : 'z-20';
    const overlayZ = 'z-[9997]';
    const hamburgerZ = 'z-[9996]';

    return (
        <>
            {/* Botón hamburguesa para móvil - Solo visible cuando el menú está cerrado */}
            {isMobile && !isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className={`fixed top-2 left-2 ${hamburgerZ} p-2.5 \
                        bg-indigo-600 text-white rounded-lg \
                        hover:bg-indigo-700 transition-colors\n                        lg:hidden`}
                    aria-label="Abrir menú"
                >
                    <RiMenu4Line size={24} />
                </button>
            )}

            {/* Overlay para móvil */}
            {isMobile && isOpen && (
                <div 
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${overlayZ}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside 
                className={`
                    fixed top-0 left-0 h-full
                    bg-[#1e1b4b] shadow-2xl
                    transition-all duration-300 ease-in-out
                    ${isMobile 
                        ? `${sidebarZ} w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `${sidebarZ} ${isOpen ? 'w-64' : 'w-20'} lg:translate-x-0`
                    }
                    lg:relative flex flex-col
                `}
            >
                {/* Header del menú */}
                <div className="sticky top-0 bg-[#1e1b4b] border-b border-indigo-800 z-10">
                    <div className="flex items-center justify-between h-16 px-4">
                        <h4 className={`
                            text-lg font-medium text-white
                            transition-all duration-300
                            ${(!isOpen && !isMobile) ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                        `}>
                            Gateway <span className="text-blue-600 font-semibold">System</span>
                        </h4>
                        {/* Botón cerrar para móvil */}
                        {isMobile && (
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full text-white hover:bg-indigo-800 transition-colors"
                            >
                                <IoIosArrowBack size={20} />
                            </button>
                        )}
                        {/* Botón toggle para desktop */}
                        {!isMobile && (
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-full text-white hover:bg-indigo-800 transition-colors"
                            >
                                <IoIosArrowBack 
                                    size={20} 
                                    className={`transform transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
                                />
                            </button>
                        )}
                    </div>
                </div>
                {/* Contenedor principal con scroll si es necesario */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                    {/* Área scrolleable */}
                    <nav className="flex-1 mt-6 px-3 space-y-1 pb-4">
                        {user && menuItemsByRole(user.role).map((item) => (
                            <SideMenuItem 
                                key={item.title}
                                {...item}
                                expanded={isOpen || isMobile}
                            />
                        ))}
                    </nav>
                </div>
                {/* Footer fijo */}
                <div className="sticky bottom-0 bg-[#1e1b4b] border-t border-indigo-800 mt-auto z-10">
                    <div className="p-4">
                        <button
                            onClick={logout}
                            className={`
                                w-full 
                                flex ${isOpen ? 'flex-row items-center gap-4 px-4' : 'flex-col items-center gap-1 px-2'} 
                                py-3 rounded-lg
                                text-gray-300 hover:bg-indigo-800/50 hover:text-white
                                transition-all duration-200 group
                            `}
                        >
                            <BiLogOut size={20} />
                            <span className={`
                                ${isOpen ? 'text-sm' : 'text-[10px]'}
                                ${isOpen ? '' : 'text-center'}
                                leading-tight transition-all duration-300
                                ${(!isOpen && !isMobile) ? 'opacity-0 h-0' : 'opacity-100 h-auto'}
                            `}>
                                Cerrar Sesión
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
