import { FC, useState } from "react"
import { useLevelStore, useSubLevelStore, useUserStore } from "../../../stores"
import { CardWithImage } from "../cards/CardWithImage";
import { FirestoreUser } from "../../../interface";
import Swal from "sweetalert2";

interface Props {
    userId: string
}
export const EditUserUnits: FC<Props> = ({ userId }) => {
    console.log(userId)
    const units = useSubLevelStore(store => store.subLevels);
    const getUserById = useUserStore(store => store.getUserById);
    const user = getUserById(userId)!;
    const updateUser = useUserStore(store => store.updateUser);
    const getUnit = useSubLevelStore(store => store.getSubLevelById);
    const getModality = useLevelStore(store => store.getLevelById);
    const [unitsForBooks, setUnitsForBooks] = useState<string[]>(user.unitsForBooks ? user.unitsForBooks : []);
    const updatedUser: FirestoreUser = { ...user, unitsForBooks };

    const handleSave = async () => {
        // return;
        Swal.fire({
            title: 'Actualizando material de apoyo',
            text: `Las unidades del usuario ${user.name} se van a modificar desea continuar?`,
            icon: 'success',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            result.isConfirmed &&
                setUnitsForBooks([]);
            console.log('👀', { updatedUser })
            // return
            await updateUser(updatedUser);
        })
    }
    // console.log('units',units.filter(unit => unit.isActive));
    // console.log('=====> unidades del usuario', { unitsForBooks: user.unitsForBooks });
    return (
        <>
            <div>
                <CardWithImage
                    title={user.role === 'student' ? `Estudiante - ${getModality(user.level!)?.name}` : 'Docente/Administrativo :'}
                    p1={user.name}
                    p2={user.role === 'student' ? 'Unidad asignada : ' + (getUnit(user.subLevel ?? '')?.name ?? '') : 'Unidad asignada : N/A'}
                />
                <div className="grid grid-cols-2 gap-2 p-2">
                    {unitsForBooks && units.filter(unit => unit.isActive).sort((a, b) => a.name > b.name ? 1 : -1).map((unit) => {

                        console.log(`buscando ${unit.id}`, unitsForBooks.includes(unit.id!));
                        return (
                            <div className="flex flex-row" key={unit.id}>
                                <input className="accent-indigo-500" checked={unitsForBooks.includes(unit.id!)} type="checkbox" id={unit.id} name={unit.name} value={unit.id}
                                    onChange={() => {
                                        if (((unitsForBooks.includes(unit.id!)))) {
                                            setUnitsForBooks((prev) => prev.filter((id) => id !== unit.id))
                                            return;
                                        }
                                        setUnitsForBooks((prev) => [...prev, unit.id!])
                                    }} />
                                <p className="pl-2 pr-2 text-indigo-800 ">{"  " + unit.name}</p>
                            </div>)
                    })}
                </div>
                <div className="flex h-[10%] justify-end">
                    <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-5 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-11"
                        type="submit"
                        onClick={handleSave}
                    >💾</button>
                </div>

            </div>
        </>
    )
}
