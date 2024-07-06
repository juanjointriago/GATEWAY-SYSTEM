import { FC, useEffect, useState } from "react"
import { useLevelStore } from "../../stores";
import { level } from "../../interface";
interface Props {
    levelId: string;
}
export const LevelById: FC<Props> = ({ levelId }) => {
    const getLevelById = useLevelStore(state => state.getLevelById);
    const [foundLevel, setFoundLevel] = useState<level>();

    const setLevelFounded = async () => {
        const newLevel = await getLevelById(levelId)
        if (newLevel) setFoundLevel(newLevel);
    }

    useEffect(() => {
        if (!levelId) return;
        setLevelFounded();
    }, [levelId])
console.log('LevelById',{foundLevel})
    return (
        <div>{foundLevel?.name ?? 'cargando'}</div>
    )
}
