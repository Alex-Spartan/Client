import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

const BookingList = () => {
  const [booking, setBooking] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const { user } = useContext(UserContext);
  console.log(user);
  useEffect(() => {
    const showBooking = async () => {
      const response = await axios.get(`/booking/user/${user._id}`);
      setBooking(response.data);
      const hotelId = response.data[0].hotel;
      const hotel = await axios.get(`/places/accomodation/${hotelId}`);
      setHotelData(hotel.data);
    };
    showBooking();
  }, [user._id]);

  if (!hotelData) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  return (
    <div>
      <div>
        <div className="m-12">
          {hotelData &&
            booking &&
            booking.map((book) => (
              <div key={hotelData._id}>
                <div>
                  <div className="my-6 p-4 md:grid md:grid-cols-5 hover:border-blue-950 hover:border-2 md:border-gray-700 md:border md:rounded-xl">
                    <div className="col-span-1">
                      <Link to={`/hotel/${hotelData._id}`}>
                        <img
                          src={`https://gotripapi.onrender.com/uploads/${hotelData.photos?.[0]}`}
                          // src={`https://gotripapi.onrender.com/uploads/${hotelData.photos?.[0]}`}
                          alt=""
                          className="md:w-[15rem] md:h-[18rem] rounded-lg"
                        />
                      </Link>
                    </div>
                    <div className="md:col-span-3 md:flex md:flex-col md:justify-around">
                      <div>
                        <Link to={`/hotel/${hotelData._id}`}>
                          <p className="text-xl font-semibold">
                            {hotelData.title}
                          </p>
                          <p>{hotelData.location}</p>
                        </Link>
                      </div>
                      <div className="text-lg font-semibold">
                        <p>CheckIn Date: {book.checkIn.split('T')[0] || ""}</p>
                        <p>CheckOut Date: {book.checkOut.split('T')[0] || ""}</p>
                      </div>
                    </div>
                    <div className="md:border-gray-700 md:border-l md:col-span-1 text-center">
                      <p className="text-xl font-semibold">${book.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BookingList;
