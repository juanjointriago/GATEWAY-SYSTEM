import { IoLogOutOutline } from 'react-icons/io5'
import { SideMenuItem } from "./SideMenuItem";
import './SideMenu.css';
import { useAuthStore } from "../../../stores/auth/auth.store";
import { Navigate } from "react-router-dom";
import { useLevelStore, useSubLevelStore, useUnitStore, useUserStore } from "../../../stores";
import { useEffect } from "react";
import { menuItemsByRole } from './menu';
import { useEventStore } from '../../../stores/events/event.store';
import { useFeesStore } from '../../../stores/fees/fess.store';
import { useNewsStore } from '../../../stores/news/news.store';
import { useProgressSheetStore } from '../../../stores/progress-sheet/progresssheet.store';
// import { useNavigate } from "react-router-dom";



export const SideMenu = () => {
  const user = useAuthStore(state => state.user);
  const getAllUsers = useUserStore(state => state.getAllUsers);
  const getAllLevels = useLevelStore(state => state.getAndSetLevels);
  const getAllSubLevels = useSubLevelStore(state => state.getAndSetSubLevels);
  const getAllUnits =  useUnitStore(state => state.getAndSetUnits);
  // const books = useUnitStore(state => state.units);
  // console.debug('✅ Inside SideMenu loadbooks =>',{books})
  // const getAllEvents = useEventStore(state => state.getEventsQuery);
  const getAllEvents = useEventStore(state => state.getAllEvents);
  const getAllFees = useFeesStore(state => state.getAndSetFees);


  const authStatus = useAuthStore(state => state.status);
  const logoutUser = useAuthStore(state => state.logoutUser);
  const getAndSetNews = useNewsStore((state) => state.getAndSetNews);
  const getAndSetProgressSheet = useProgressSheetStore((state) => state.getAllProgressSheets);
  
  // const navigate = useNavigate()
  useEffect(() => {
    getAllUsers();
    getAllLevels();
    getAllSubLevels();
    getAllEvents();
    getAllUnits();
    getAllFees();
    getAndSetNews();
    getAndSetProgressSheet();
  }, [ getAllUsers, getAllLevels, getAllSubLevels, getAllEvents, getAllUnits, getAllFees, getAndSetNews, getAndSetProgressSheet]);


  if (authStatus === 'unauthorized') {
    return <Navigate to="/auth/signin" />
  }
  // console.debug({ user })

  return (
    <div id="menu" className=" min-w-[20rem] bg-gray-900 min-h-screen z-10 text-slate-300 w-80 left-0 overflow-y-scroll">
      <div id='logo' className="my-4 px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white">
          Gateway
          <span className="text-blue-500 text-xs"> Corp.</span>
        </h1>
        <p className="text-slate-500 text-sm">Tu mejor alternativa en idiomas.</p>
      </div>

      {/*  Profile */}
      <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Bienvenid@ ,</p>
        <a href="hhtps://gateway-english.com" className="inline-flex space-x-2 items-center">
          <span>
            <img className="rounded-full w-8 h-8" src={user?.photoUrl ?? 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80'} alt="" />
          </span>
          <span className="text-sm md:text-base font-bold">
            {user?.name ?? ''}
          </span>
        </a>
      </div>

      {/* Menu Items */}
      <nav id="nav" className="w-full px-6">
        {
          user && menuItemsByRole(user.role).map(item => (
            <SideMenuItem key={item.href} {...item} expanded={item.expandible} />
          ))
        }

        {/**Logout */}
        <div className="mt-10" onClick={() => {
          logoutUser();
          // navigate('/')
        }}>
          <div>
            <IoLogOutOutline />
          </div>
          <div className="flex flex-col">
            <span className="text-lg text-slate-300 font-bold leading-5">Logout</span>
            <span className="text-sm text-slate-500 hidden md:block">Cerrar sesión</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
