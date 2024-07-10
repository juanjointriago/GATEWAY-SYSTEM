import { FC } from "react"
import { students } from "../../interface"
import { UserById } from "./UserById";

interface Props {
    record: students
}
export const StudentsList: FC<Props> = ({ record }) => {
    const keys = Object.keys(record);
    return (
        <div>{
            keys.map((key) => {
                return <div key={key}>
                    <UserById userId={key} />
                    {record[key].status}
                    </div>
            })
        }</div>
    )
}
