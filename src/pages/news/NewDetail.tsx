import { FC } from "react";

interface Props {
uuid:string;
}
export const NewDetail:FC<Props> = ({uuid}) => {

  return (
    <div>{uuid}</div>
  )
}
