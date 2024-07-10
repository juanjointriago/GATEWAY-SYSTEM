import { FC } from "react"

interface Props {
    title: string;
    tootTipText: string;
    action?: () => void;
    children?: React.ReactNode;
}
export const TootipBase: FC<Props> = ({ title, tootTipText, action = () => console.log('pressed'), children }) => {
    return (
        <div className="group relative m-1 flex justify-center">
            {children ?? <button className="line-clamp-3 w-40 rounded bg-indigo-500 px-2 py-2 text-sm text-white shadow-sm" onClick={action}>
                {title}
            </button>}
            <span className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                {tootTipText} ✨
            </span>
        </div>
    )
}
