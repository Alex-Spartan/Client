import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
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
          <div className="pb-8 md:py-12 border-b-2 border-black" key={room._id}>
            <div className="flex flex-col items-center justify-center md:items-start md:justify-start md:flex-row gap-14">
              <div className="relative">
                <button
                  className="absolute left-2 md:left-4 top-1/2 text-black bg-gray-400 bg-opacity-65 rounded-full p-1 cursor-pointer"
                  onClick={() => moveImage("left", room)}
                >
                  <IoArrowBackCircleOutline size={25} />
                </button>

                <div className="">
                  <img
                    // src={`https://gotripapi.onrender.com/uploads/${
                    //   room?.photos?.[roomImageIndexes[room._id] || 0]
                    // }`}
                    src="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-[24rem]"
                    alt="image"
                  />
                </div>

                <button
                  className="absolute right-4 top-1/2 text-black bg-gray-400 bg-opacity-65 rounded-full p-1 cursor-pointer"
                  onClick={() => moveImage("right", room)}
                >
                  <IoArrowForwardCircleOutline size={25} />
                </button>
                <div className="absolute right-6 bottom-2 bg-slate-400 bg-opacity-40 font-bold p-1 rounded-lg">
                  {(roomImageIndexes[room?._id] || 0) + 1}/
                  {room.photos?.length}
                </div>
              </div>
              <div className="">
                <div className="text-center">
                  <h3 className="text-xl font-medium">{room.roomType}</h3>
                </div>
                <div className="mt-8 text-lg grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-x-24 md:gap-y-6">
                  {room.amenities.map((amenity, index) => (
                    <p key={index} className="text-lg">{amenity}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-16">
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
