import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import Header from "../components/Header";
import { loadStripe } from "@stripe/stripe-js";
import Footer from "../components/Footer";

const Booking = () => {
  const [hotel, setHotel] = useState({});
  const [guest, setGuest] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [nights, setNights] = useState(1);
  const { user, price, setPrice, checkIn, checkOut, rooms } =
    useContext(UserContext);

  const [total, setTotal] = useState(price);
  const [tax, setTax] = useState(Math.round(price * 0.18));
  const { id } = useParams();

  useEffect(() => {
    const fetchHotel = async () => {
      const response = await axios.get("/places/accomodation/" + id);
      setHotel({...response.data });
    };
    const calculateNights = (checkIn, checkOut) => {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return differenceInDays;
    };
    setNights(calculateNights(checkIn, checkOut));

    fetchHotel();
    setPrice(price * nights * rooms);
    setTotal(price + tax);
  }, [setHotel, checkIn, checkOut]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setGuest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const makePayment = async (e) => {
    e.preventDefault();
    setGuest({ ...guest, guestId: user._id });

    
    const bookingData = {price, hotel: hotel._id, checkIn, checkOut, }
    // console.log(bookingData)
    const userBooking = await axios.post(`/booking/userBooking/${user._id}`, bookingData);

    const guestData = await axios.post(`/booking/roomBooking/${id}`, guest);
    console.log(guestData.data);
    console.log(userBooking.data);
    
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const response = await axios.post('/booking/create-checkout-session', { price: total });
    const session = response.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    console.log(result);
    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="">
        <div className="py-7 px-5 p-2 bg-[#272D2D] md:py-6 md:px-16">
          <h1 className="text-3xl font-bold text-white pb-12">
            Review Booking
          </h1>
        </div>
        <div className="py-4 px-5 p-2 md:py-6 md:px-16 md:grid grid-cols-12 relative md:-translate-y-6 -top-12">
          <div className="md:col-span-1"></div>
          <div className="flex flex-col z-10 bg-white  p-8 col-span-7 border border-gray-400 shadow-lg rounded-b-md rounded-lg">
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold">{hotel.title}</h1>
                <p className="text-xl">{hotel.location}</p>
              </div>
              <div>
                <img
                  // src={`https://gotripapi.onrender.com/uploads/${hotel.photos?.[0]}`}
                  src={`https://gotripapi.onrender.com/uploads/${hotel.photos?.[0]}`}
                  className="w-[8rem]"
                  alt=""
                />
              </div>
            </div>
            <div className="flex justify-between border-dotted border-t-2 border-orange-300 mt-8 pt-8">
              <div className="flex justify-start items-center gap-6">
                <div>
                  <p className="text-xs">CHECK IN</p>
                  <p className="text-lg">{checkIn}</p>
                  <p className="text-xs">3 PM</p>
                </div>
                <div className="text-sm font-semibold">{nights} Nights</div>
                <div>
                  <p className="text-xs">CHECK OUT</p>
                  <p className="text-lg">{checkOut}</p>
                  <p className="text-xs">3 PM</p>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="px-3 border-r-2 border-gray-400">
                  {nights} Night
                </div>
                <div className="px-3">1 Room</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1"></div>
          <div className="col-span-3 bg-white border border-gray-400 shadow-lg rounded-lg py-4 px-8">
            <div className="py-4">
              <h1 className="text-xl">Price breakup</h1>
            </div>
            <div className="mt-6 flex flex-col">
              <div>{nights} Night x 1 Room</div>
              <div className="mt-2 flex justify-between">
                <span className="text-sm">Price:</span>
                <span className="float-right">₹{price}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm">Taxes:</span>
                <span className="float-right">{tax}</span>
              </div>
            </div>
            <div className="mt-4 py-4 border-t-2">
              <div className="flex justify-between">
                <span className="text-sm">Total:</span>
                <span className="float-right">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 px-5 p-2 md:py-6 md:px-16 text-white bg-[#272D2D]">
          <h1 className="text-3xl font-bold ">Guest Information</h1>
        </div>
        <div className="py-4 px-5 p-2 md:py-6 md:px-16 ">
          <div className="grid grid-cols-12">
            <div className="col-span-1"></div>
            <form className="col-span-10 md:col-span-7" onSubmit={makePayment}>
              <div className="py-4 px-5 p-2 md:py-6 md:px-16 flex flex-col gap-4 border border-slate-400 rounded-lg shadow-lg">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={guest.name}
                    onChange={handleChange}
                    className="h-8 border-2 p-2 mt-1 border-slate-300 block w-full rounded-md"
                  />
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={guest.email}
                    onChange={handleChange}
                    className="h-8 border-2 p-2 mt-1 border-slate-300 block w-full rounded-md"
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={guest.phone}
                    onChange={handleChange}
                    className="h-8 border-2 p-2 mt-1 border-slate-300 block w-full rounded-md"
                  />
                </div>
                <div className="">
                  {user === null || checkIn === "" || checkOut === "" ? (
                    <p className="text-red-500">
                      Please login / pick dates to proceed to payment
                    </p>
                  ) : (
                    <button className="mt-3 py-2 px-8 text-white font-semibold bg-gradient-to-l to-[#019FCB] from-[#20CEFE] rounded-xl border-none outline-none">
                      Procced to payment
                    </button>
                  )}
                </div>
              </div>
            </form>
            <div className="col-span-4"></div>
          </div>
          <div className="my-6 mx-16 "></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
