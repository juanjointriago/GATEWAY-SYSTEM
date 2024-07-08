import { useState } from "react";
import { menuItems } from "./menu";
import { SideBarItem } from "./SideBarItem";
import { ModalOverlay } from "./ModalOverlay";
import { useAuthStore } from "../../../stores";


export const SideBar = () => {
    const user = useAuthStore((state) => state.user)
    let show ;
    const [expanded, setExpanded] = useState(false)
    const logo = './favicon.ico';
    const className = "bg-black w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
    const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

    return (
        <>
            <div className={`${className}${appendClass}`}>
                <div className="p-2 flex">
                    <div >
                        {/*eslint-disable-next-line*/}
                        <img src={logo} alt="Company Logo" width={300} height={300} />
                    </div>
                    <div className="flex flex-col">
                        {
                            menuItems(user?.role?? 'student').map((item) => (
                                <SideBarItem Icon={item.Icon} expanded={expanded} setExpanded={setExpanded} href={item.href} text={item.title} />))
                        }
                    </div>
                </div>
            </div>
            {show ?<ModalOverlay expanded={expanded} setExpanded={setExpanded}/>:<></>}
        </>
    )
}
