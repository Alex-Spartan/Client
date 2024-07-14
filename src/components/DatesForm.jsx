import { useContext } from "react";
import { UserContext } from "../UserContext";

const DatesForm = () => {
  const { checkIn, setCheckIn, checkOut, setCheckOut,  rooms, setRooms, setDatefns } = useContext(UserContext);

  return (
    <div className="mt-12 flex flex-col justify-center w-1/2 mx-auto">
          <div className="text-3xl font-bold">
            <h1>Choose your stay</h1>
          </div>

          <div className="mt-4  ">
            <form className="py-6 border-gray-400 border-2 shadow-lg rounded-lg flex flex-col justify-center items-center">
              <div className="flex  gap-12 justify-center items-center p-8">
                <div className="flex justify-center">
                  <div className="border-l border-t border-b border-black p-1 rounded-r-none rounded-l-md font-semibold">
                    <input
                      value={checkIn}
                      className="p-1 border-r border-gray-400 outline-none"
                      type="date"
                      name="check-in"
                      onChange={e => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="border-r border-t border-b border-black p-1 rounded-l-none rounded-b-md rounded-r-md font-semibold">
                    <input
                      value={checkOut}
                      className="p-1 outline-none"
                      type="date"
                      name="check-in"
                      onChange={e => {
                        setCheckOut(e.target.value)
                        setDatefns(true)
                      }}
                      min={checkIn ? checkIn : new Date().toISOString().split('T')[0]}

                    />
                  </div>
                </div>
                <div className="mx-2 border-black border-none p-1">
                  <select
                    className="p-2 border-black border rounded-lg font-semibold"
                    placeholder="members"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                  >
                    <option className="border-none p-2" value="1">
                      1 guest, 1 Room
                    </option>
                    <option className="border-none p-2" value="1">
                      2 guests, 1 Room
                    </option>
                    <option className="border-none p-2" value="2">
                      4 guests, 2 Room
                    </option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
  )
}

export default DatesForm