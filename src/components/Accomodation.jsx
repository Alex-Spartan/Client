import { Link, useParams } from "react-router-dom";
import { IoAdd } from "react-icons/io5";

import AccomodationForm from "./AccomodationForm";
import { useEffect, useState } from "react";
import axios from "axios";

const Accomodation = () => {
  const { action } = useParams();
  const [accomodation, setAccomodation] = useState([]);
  useEffect(() => {
    const fetchAccomodation = async () => {
      const response = await axios.get("/places/accomodation");
      setAccomodation(response.data);
    };
    fetchAccomodation();
  }, [setAccomodation]);

  const deleteRoom = async (roomId, placeId) => {
    const response = await axios.delete(`/places/rooms/${roomId}?placeId=${placeId}`);
    const updatedRooms = accomodation.map(place => {
      if (place._id === placeId) {
        return {
          ...place,
          rooms: place.rooms.filter(room => room._id !== roomId)
        }
      }
      return place;
    })
    setRooms(updatedRooms);
  }

  return (
    <div className="mt-6">
      {action !== "new" && (
        <div className="flex justify-center ">
          <Link
            to={"new"}
            className="flex items-center gap-1 text-white bg-[#272D2D] px-3 py-1 rounded-2xl"
          >
            <div>
              <IoAdd />
            </div>
            Add new place
          </Link>
        </div>
      )}

      {action === "new" && <AccomodationForm />}

      {accomodation &&
        accomodation.map((place, index) => (
          <div className="m-4 md:flex md:justify-between" key={index}>
            <div className="border border-blue-400 rounded-md  md:w-full md:p-4 md:h-full">
              <div className="grid grid-cols-7">
                <div className="col-span-1 mt-3 md:mt-0 md:flex">
                  <img
                    width={250}
                    height={220}
                    // src={`http://localhost:3000/uploads/${place.photos[0]}`}
                    src={`https://gotripapi.onrender.com/uploads/${place.photos[0]}`}
                    alt="image"
                    className="w-[13rem] h-[15rem]"
                  />
                </div>
                <div className="col-span-3 my-5 px-4 flex justify-between md:flex-col">
                  <Link to={`${place._id}`}>
                    <div className="ml-2">
                      <p className="text-2xl text-center font-bold md:text-left">
                        {place.title}
                      </p>
                      <p className="font-semibold text-center md:text-left">
                        {place.location}
                      </p>
                    </div>
                  </Link>
                  <Link to={`${place._id}/rooms`} className="m-1">
                    <button className="p-2 text-white font-medium bg-black border-none rounded-md">+ Add rooms and prices</button>
                  </Link>
                </div>
                <div className="col-span-3 border-l-2 border-gray-400 h-full w-full">
                  <div className="mx-3 my-2 h-full w-full">
                    <div className="p-2 h-full w-full">
                      <table className="border border-gray-500 w-full">
                        <thead className="w-full border border-gray-500 bg-black text-white">
                          <tr className="flex justify-around w-full my-2">
                            <th className="flex justify-center">Room Name</th>
                            <th className="flex justify-center">Price</th>
                            <th className="flex justify-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="w-full">
                          {place.rooms.map((room, index) => (
                            <tr className="flex justify-around items-center w-full py-4 border-b border-gray-400" key={index}>
                              <td className="flex justify-center">{room.roomType}</td>
                              {room.refundPrice !== null ? (<td className="flex justify-center">{room.truePrice} and {room.refundPrice}</td>) : (<td className="flex justify-center">{room.truePrice}</td>)}
                              <td className="flex flex-col justify-center">
                                <button onClick={() => deleteRoom(room._id, place._id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>

                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Accomodation;
