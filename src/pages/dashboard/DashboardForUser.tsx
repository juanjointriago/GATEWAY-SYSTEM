import { FC } from "react";
import { FirestoreUser } from "../../interface";
import { DashboardAdmin } from "./DashboardAdmin";
import { DashboardStudent } from "./DashboardStudent";
import { DashboardTeacher } from "./DashboardTeacher";



interface Props {
    user: FirestoreUser
}
export const DashboardForUser: FC<Props> = ({ user }) => {
    switch (user.role) {
        case 'admin':
            return <DashboardAdmin />
        case 'student':
            return <DashboardStudent user={user}/>
        case 'teacher':
            return <DashboardTeacher />

        default:
            return <DashboardStudent user={user}/>
    }
}
