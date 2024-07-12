import { FC, useEffect, useState } from "react";
import { useUserStore } from "../../stores";
import { FirestoreUser } from "../../interface";
import { TootipBase } from "../../components/shared/buttons/TootipBase";

interface Props {
    userId: string;
}
export const UserInfoTooltip: FC<Props> = ({ userId }) => {
    const getUserById = useUserStore(state => state.getUserById);
    const [foundUser, setFoundUser] = useState<FirestoreUser>()
    const setUser = async () => {
        const newUser = await getUserById(userId)
        if (newUser) {
            // console.log('HAY SUBNIVELLLLL')
            setFoundUser(newUser)
        }
    }

    useEffect(() => {
        setUser();
    }, [])

    return (
        <> {foundUser && <TootipBase tootTipText={`${foundUser.name}-${foundUser.email}`} title={`${foundUser.name}`} />}  </>
    )
}