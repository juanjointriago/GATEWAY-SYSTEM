import { FC, ReactElement } from "react"

interface Props {
    isVisible: boolean
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
    title?: string
    children?: ReactElement
}
const Nothing = () => {
    return <div>No Content</div>
}
export const ModalGeneric: FC<Props> = ({ isVisible, setIsVisible, title = 'Modal Title', children = <Nothing /> }) => {

    return (
        <>
            {isVisible ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        {title}
                                    </h3>
                                    <div className="ml-80 flex items-center justify-end  border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="bg-blue-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setIsVisible(false)}
                                        >
                                            X
                                        </button>
                                    </div>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setIsVisible(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="h-[30rem] relative p-6 flex-auto">
                                    {children}
                                </div>
                                {/*footer*/}

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}
