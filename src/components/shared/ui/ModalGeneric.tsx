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
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-w-full w-full">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none ">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold mr-5">
                                        {title}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-blue-700 border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setIsVisible(false)}
                                    >
                                        <span className="bg-transparent text-white h-8 w-8 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="h-[80%] relative p-6 flex-auto">
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
