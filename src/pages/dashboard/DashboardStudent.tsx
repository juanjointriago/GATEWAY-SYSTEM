import { FC } from "react";
import { FirestoreUser } from "../../interface";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBook, IoCalendar, IoPieChart } from "react-icons/io5";
import { LevelById } from "../levels/LevelById";
import { useUnitStore } from "../../stores";

interface Props {
    user: FirestoreUser
}
export const DashboardStudent: FC<Props> = ({ user }) => {
    const events = useEventStore(state => state.events);
    const eventsStudent = events.filter(event => event.students[user.id!])
    const units = useUnitStore(state => state.units);
    const booksStudent = units.length
    // const myEvent = 
    // console.log('sublevel',user.subLevel)
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <WhiteCard centered>
                <IoPieChart size={48} className="text-indigo-600" />
                <h2>Modalidad</h2>
                {user && user.level ?<LevelById levelId={user.level} />: "Sin modalidad asignada"}
            </WhiteCard>
            {/* <WhiteCard centered>
                <IoBarChart size={48} className="text-indigo-600" />
                <h2>Unidades</h2>
                <>{user && user.subLevel?<SubLevelById subLevelId={user.subLevel}/>: 'Sin asignar'}</>
            </WhiteCard> */}
            <WhiteCard centered>
                <IoCalendar size={48} className="text-indigo-600" />
                <h2>Clases reserv. </h2>
                <p>{eventsStudent.length}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoBook size={48} className="text-indigo-600" />
                <h2>Libros </h2>
                <p>{booksStudent}</p>
            </WhiteCard>
        </div>)
}