import { FC } from "react"

interface Props {
    message?: string;
}
export const Loading: FC<Props> = ({ message }) => {
    console.log({ message });
    
    return (
        <div className="bg-indigo-500">
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
        </div>
    )
}
