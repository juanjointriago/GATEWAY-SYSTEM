import { FC } from "react"

interface Props {
    title: string
    tootlip: string
    styleExtra?: string
}

export const TootipSimple: FC<Props> = ({ title, tootlip, styleExtra = undefined }) => {
    return (
        <div className={`group relative flex`}>
            <span
                className='absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100'>
                {tootlip}
            </span>
            <span className={styleExtra}>
                {title}
            </span>
        </div>
    )
}
