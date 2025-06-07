import { FC, useEffect, useState } from "react";
import { useUserStore } from "../../stores";
import { FirestoreUser } from "../../interface";

interface Props{ 
  userId: string;
}
export const UserById:FC<Props> = ({userId}) => {
  const getUserById = useUserStore(state => state.getUserById);
  const [foundUser, setFoundUser] = useState<FirestoreUser>()
  const setUser = async () => {
    const newUser = await getUserById(userId)
    if (newUser) {
        // console.debug('HAY SUBNIVELLLLL')
        setFoundUser(newUser)
    }
}

  useEffect(() => {
    setUser();
  }, [])
  
  return (
    <>
    {
      foundUser&& <span>{foundUser.name}</span>
    }
    </>
  )
}
