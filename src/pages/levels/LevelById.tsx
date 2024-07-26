import { FC, useEffect, useState } from "react"
import { useLevelStore } from "../../stores";
import { level } from "../../interface";
interface Props {
    levelId: string;
}
export const LevelById: FC<Props> = ({ levelId }) => {
    // console.log({levelId})
    const getLevelById = useLevelStore(state => state.getLevelById);
    const [foundLevel, setFoundLevel] = useState<level>();

    const setLevelFounded = async () => {
        const newLevel = await getLevelById(levelId)
        if (newLevel) {
            setFoundLevel(newLevel)
        }
    }

    useEffect(() => {
        setLevelFounded();
    }, [levelId])
    // console.log('LevelById', { foundLevel })
    return (
        <>
            {foundLevel && <div>{foundLevel.name}</div>}
        </>
    )
}
