import { FC, useEffect, useState } from "react";
import { useSubLevelStore } from "../../stores";
import { subLevel } from "../../interface";

interface Props {
    subLevelId: string;
}

export const SubLevelById:FC<Props> = ({subLevelId}) => {
    const getSubLevelById = useSubLevelStore(state => state.getSubLevelById);
    const [foundSubLevel, setFoundSubLevel] = useState<subLevel>();
    
    const setSubLevel = async () => {
        const newLevel = await getSubLevelById(subLevelId)
        if (newLevel) {
            console.log('HAY NIVELLLLL')
            setFoundSubLevel(newLevel)
        }
    }

    useEffect(() => {
        setSubLevel();
    }, )
  return (
    
    <>
        {foundSubLevel && <div>{foundSubLevel.name}</div>}

    </>
  )
}
