import { FC } from "react";
import { useUserStore } from "../../../stores";

interface Props {
  userId: string;
}
export const EditStudentSheet: FC<Props> = ({ userId }) => {
  const getUserById = useUserStore((state) => state.getUserById);
  // console.log({userId})
  const user = getUserById(userId);
  console.log({ user });
  return (
    // <div>EditStudentSheet{ userId }</div>
    <>
      <div className="flex flex-col items-center border-black border-2 rounded-lg p-7 m-5">
        <div className="flex flex-row items-center m-3">
          <img
            className="rounded-full w-36 h-36 bg-gray-500"
            src={user?.photoURL ?? user?.photoUrl}
            alt="Image"
          />
          <div className="border-black border-2 rounded-lg p-7 m-3">
            <div className="text-center mb-5">Headline</div>
            <div className="flex flex-row justify-between">
              <div className="text-gray-500">ID Nro:</div>
              <div className=" ml-10">1234</div>
              <div className="text-gray-500 pl-5">REG Nro:</div>
              <div className=" ml-10">12345</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-gray-500">INSCRIPTION DATE:</div>
              <div className=" ml-10">01/01/2023</div>
              <div className="text-gray-500 pl-5">EXPIRATION:</div>
              <div className=" ml-10">01/01/2024</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-gray-500">MY FULL NAME IS:</div>
              {user && <div className=" ml-10">{user.name}</div>}
            </div>
            {user && user.bornDate.length > 0 && (
              <div className="flex flex-row justify-between">
                <div className="text-gray-500">MY BIRTHDATE IS:</div>
                <div className=" ml-10">{user.bornDate}</div>
              </div>
            )}
            <div className="flex flex-row justify-between">
              <div className="text-gray-500">OTHER CONTACTS:</div>
              <div className=" ml-10">__________________________</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-gray-500">OBSERVATION:</div>
              <div className=" ml-10">__________________________</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
