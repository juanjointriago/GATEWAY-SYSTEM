
import { useAuthStore } from "../../stores"
import { DashboardForUser } from "./DashboardForUser";

export const DashboardPage = () => {

  const user = useAuthStore(state => state.user);

  
  return (
    <>
      {user && <DashboardForUser user={user} />}
    </>
  )
}
