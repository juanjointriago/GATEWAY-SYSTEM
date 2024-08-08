import { FC } from "react"

interface Props {
    title?:string;
    urlImg?:string;
    p1?:string;
    p2?:string;

}
export const CardWithImage:FC<Props> = ({title='No title', p1='Paragraph 1', p2='Paragraph 2', urlImg= 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd'}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-md shadow">
        <img className="bg-white h-32 rounded-s-sm" src={urlImg} alt="" />
    <div className="p-1">
        <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{p1}</p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{p2}</p>

    </div>
</div>
  )
}
