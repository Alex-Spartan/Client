import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const RoomOffer = ({ roomPrice, refund }) => {
  const { setPrice, checkIn, checkOut } = useContext(UserContext);

  return (
    <div className="w-[20rem] h-[12rem] mt-16 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-700">1 Room x 1 Night:</p>
        <span className="text-xl font-semibold">₹{roomPrice}</span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-700">Cancellation Policy:</p>
        <p className="">{refund}</p>
      </div>

      {checkIn &&
        checkOut && (
          <Link
            onClick={() => {
              setPrice(roomPrice);
            }}
            className="mt-auto bg-[#01BFF4] text-white font-medium py-2 px-4 rounded-md"
            to={`booking`}
          >
            Book
          </Link>
        )}

        {(!checkIn || !checkOut) && (
          <p className="text-red-500 font-bold">Choose Date to continue!</p>
        )}
    </div>
  );
};

export default RoomOffer;
