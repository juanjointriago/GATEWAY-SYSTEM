import { FC } from "react";
import { useLevelStore, useSubLevelStore, useUnitStore, useUserStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBarChart, IoBook, IoCalendar, IoPerson, IoPersonAdd, IoPersonAddOutline, IoPersonRemove, IoPersonRemoveOutline, IoPieChart } from "react-icons/io5";

export const DashboardAdmin: FC = () => {
    const users = useUserStore(state => state.users);
    const levels = useLevelStore(state => state.levels);
    const subLevels = useSubLevelStore(state => state.subLevels);
    const events = useEventStore(state => state.events.length);
    const units = useUnitStore(state => state.units.length);
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <WhiteCard centered>
                <IoPerson size={48} className="text-indigo-600" />
                <h2>Usuarios</h2>
                <p>{users.length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoPieChart size={48} className="text-indigo-600" />
                <h2>Modalidades</h2>
                <p>{levels.length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoBarChart size={48} className="text-indigo-600" />
                <h2>Cursos</h2>
                <p>{subLevels.length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoCalendar size={48} className="text-indigo-600" />
                <h2>Últ Clases reserv. </h2>
                <p>{events}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoBook size={48} className="text-indigo-600" />
                <h2>Libros En plataforma </h2>
                <p>{units}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoPersonAdd size={48} className="text-indigo-600" />
                <h2>Estudiantes</h2>
                <p>{users.filter((user) => user.role === 'student').length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoPersonAddOutline size={48} className="text-indigo-600" />
                <h2>Docentes</h2>
                <p>{users.filter((user) => user.role === 'teacher').length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoPersonRemove size={48} className="text-indigo-600" />
                <h2>Estudiantes Inactivos</h2>
                <p>{users.filter((user) => user.role === 'student' && (user.isActive === true)).length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoPersonRemoveOutline size={48} className="text-indigo-600" />
                <h2>Docentes Inactivos</h2>
                <p>{users.filter((user) => user.role === 'student' && (user.isActive === false)).length}</p>
            </WhiteCard>
        </div>)
}