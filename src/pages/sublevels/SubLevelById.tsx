import { FC, useEffect, useState } from "react";
import { useSubLevelStore } from "../../stores";
import { subLevel } from "../../interface";

interface Props {
    subLevelId: string;
}

export const SubLevelById: FC<Props> = ({ subLevelId }) => {
    const getSubLevelById = useSubLevelStore(state => state.getSubLevelById);
    const [foundSubLevel, setFoundSubLevel] = useState<subLevel>();

    const setSubLevel = async () => {
        const newLevel = await getSubLevelById(subLevelId)
        if (newLevel) {
            // console.debug('HAY SUBNIVELLLLL')
            setFoundSubLevel(newLevel)
        }
    }

    useEffect(() => {
        setSubLevel();
    }, [subLevelId])
    return (

        <>
            {foundSubLevel && <div>{foundSubLevel.name}</div>}

        </>
    )
}
