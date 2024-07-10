
import { useAuthStore } from "../../stores"
import { DashboardForUser } from "./DashboardForUser";

export const DashboardPage = () => {

  const user = useAuthStore(state => state.user);

  
  return (
    <>
      <h1>Dashboard</h1>
      <p>Información colectiva de todas las entidades de Gateway</p>
      <hr />
      {user && <DashboardForUser user={user} />}
    </>
  )
}
