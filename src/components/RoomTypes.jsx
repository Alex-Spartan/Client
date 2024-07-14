import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import RoomOffer from "./RoomOffer";

const RoomTypes = () => {
  const [rooms, setRooms] = useState([]);
  const [roomImageIndexes, setRoomImageIndexes] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchHotel = async () => {
      const response = await axios.get("/places/accomodation/" + id);
      setRooms(response.data.rooms);
    };
    fetchHotel();
  }, [setRooms]);
  const moveImage = (direction, room) => {
    const roomId = room._id;
    const maxImages = room.photos.length;
    setRoomImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[roomId] || 0;
      let newIndex;
      if (direction === "left") {
        newIndex = currentIndex - 1 < 0 ? maxImages - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex + 1 >= maxImages ? 0 : currentIndex + 1;
      }
      return { ...prevIndexes, [roomId]: newIndex };
    });
  };

  return (
    <>
      {rooms.length > 0 &&
        rooms.map((room) => (
          <div className="py-12 border-b-2 border-black" key={room._id}>
            <div className="flex gap-14">
              <div className="relative">
                <button
                  className="absolute left-4 top-1/2 text-black bg-gray-400 bg-opacity-65 rounded-full p-1 cursor-pointer"
                  onClick={(e) => moveImage("left", room)}
                >
                  <IoArrowBackCircleOutline size={25} />
                </button>

                <div className="">
                  <img
                    src={`https://gotripapi.onrender.com/uploads/${
                      room.photos?.[roomImageIndexes[room._id] || 0]
                    }`}
                    // src={`http://localhost:3000/uploads/${
                    //   room?.photos?.[roomImageIndexes[room._id] || 0]
                    // }`}
                    className="w-[24rem]"
                    alt="image"
                  />
                </div>

                <button
                  className="absolute right-4 top-1/2 text-black bg-gray-400 bg-opacity-65 rounded-full p-1 cursor-pointer"
                  onClick={(e) => moveImage("right", room)}
                >
                  <IoArrowForwardCircleOutline size={25} />
                </button>
                <div className="absolute right-6 bottom-2 bg-slate-400 bg-opacity-40 font-bold p-1 rounded-lg">
                  {(roomImageIndexes[room?._id] || 0) + 1}/
                  {room.photos?.length}
                </div>
              </div>
              <div>
                <div>
                  <h3 className="text-xl font-medium">{room.roomType}</h3>
                </div>
                <div className="mt-8 text-lg grid gap-x-24 gap-y-6 grid-cols-3">
                  {room.amenities.map((amenity, index) => (
                    <p key={index} className="text-lg">{amenity}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-16">
              {room.truePrice && (
                <RoomOffer
                  roomPrice={room.truePrice}
                  refund={"Not refundable"}
                />
              )}
              {room.refundPrice && (
                <RoomOffer roomPrice={room.refundPrice} refund={"Refundable"} />
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default RoomTypes;
