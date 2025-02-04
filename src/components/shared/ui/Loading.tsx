import { FC } from "react"

interface Props{
h?:string;
w?:string
borderColor?:string
}
export const Loading: FC<Props> = ({ h=12, w=12, borderColor='blue'}) => {
    return (
        <div className={`rounded-md h-${h} w-${w} border-4 border-t-4 border-${borderColor}-700 animate-spin absolute`}></div>
    )
}
