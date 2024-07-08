import { FC } from "react";

interface Props {
    expanded: boolean;
    setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModalOverlay:FC<Props> = ({expanded, setExpanded}) => {

    return (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setExpanded!(!expanded);
            }}
        />
    )
}
