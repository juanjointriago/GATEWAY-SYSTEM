import { FC } from "react";
import { FirestoreUser } from "../../interface";
import { useEventStore } from "../../stores/events/event.store";
import { WhiteCard } from "../../components";
import { IoBarChart, IoCalendar, IoPieChart } from "react-icons/io5";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";

interface Props {
    user: FirestoreUser
}
export const DashboardStudent: FC<Props> = ({ user }) => {
    const events = useEventStore(state => state.events);
    const eventsStudent = events.filter(event => event.students[user.id!])
    // const myEvent = 
    console.log('sublevel',user.subLevel)
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <WhiteCard centered>
                <IoPieChart size={48} className="text-indigo-600" />
                <h2>Modalidades</h2>
                {user && user.level ?<LevelById levelId={user.level} />: "Sin modalidad asignada"}
            </WhiteCard>
            <WhiteCard centered>
                <IoBarChart size={48} className="text-indigo-600" />
                <h2>Cursos Tomados</h2>
                <p>{user && user.subLevel?<SubLevelById subLevelId={user.subLevel}/>: 'No ha tomado Cursos'}</p>
            </WhiteCard>
            <WhiteCard centered>
                <IoCalendar size={48} className="text-indigo-600" />
                <h2>Clases reserv. </h2>
                <p>{eventsStudent.length}</p>
            </WhiteCard>
        </div>)
}