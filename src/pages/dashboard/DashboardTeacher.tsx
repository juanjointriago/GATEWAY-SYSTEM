import { FC } from "react";
import { useAuthStore, useUnitStore } from "../../stores";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import {  IoBook, IoCalendar } from "react-icons/io5";

export const DashboardTeacher: FC = () => {
    const user = useAuthStore(state => state.user);
    const events = useEventStore(state => state.events);
    const units = useUnitStore(state => state.units);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            <WhiteCard centered>
                <IoCalendar size={48} className="text-indigo-600" />
                <h2>Últ Clases reserv. </h2>
                <p>{user && events.filter((event) => event.teacher === user.id).length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoBook size={48} className="text-indigo-600" />
                <h2>Libros</h2>
                <p>{units.length}</p>
            </WhiteCard>
        </div>)
}