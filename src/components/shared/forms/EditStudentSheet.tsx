import { FC } from "react";

interface Props {
    userId: string;
}
export const EditStudentSheet:FC<Props> = ({userId}) => {
    console.log({userId})
  return (
    <div>EditStudentSheet{ userId }</div>
  )
}
