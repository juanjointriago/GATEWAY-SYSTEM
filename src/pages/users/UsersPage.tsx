import { WhiteCard } from "../../components"

export const UsersPage = () => {
  return (
    <>
    <h1>Usuarios</h1>
    <p>Información de todos los usuarios dentro del sistema</p>
    <hr/>

    <WhiteCard className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <form>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]"> </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </WhiteCard>
    </>
  )
}
