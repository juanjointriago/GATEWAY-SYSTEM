import { FC } from "react"

interface Props {
    title: string;
    tootTipText: string | undefined;
    action?: () => void;
    children?: React.ReactNode;
}
export const TootipBase: FC<Props> = ({ title, tootTipText, action = () => console.debug('pressed'), children }) => {
    return (
        <div className="group relative m-1 w-10 h-10 rounded-full bg-indigo-500">
            {children ?? <button className="line-clamp-3 w-40 rounded bg-indigo-500 px-2 py-2 text-sm text-white shadow-sm" onClick={action}>
                {title}
            </button>}
            {tootTipText && <span className="absolute top-10 right-0 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                {tootTipText} 
            </span>}
        </div>
    )
}
