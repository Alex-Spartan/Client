import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";

import { IoLocationSharp } from "react-icons/io5";
import RoomTypes from "../components/RoomTypes";
import DatesForm from "../components/DatesForm";

const ListingPage = () => {
  const [hotel, setHotel] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchHotel = async () => {
      const response = await axios.get("/places/accomodation/" + id);
      setHotel(response.data);
    };
    fetchHotel();
  }, []);

  return (
    <div>
      <Header />
      <div className="px-6 py-8 md:px-16 md:py-12 bg-[#FBFBFF]">
        <div className="flex justify-center">
          <div className="m-2 flex-1">
            <div className="flex">
              <div className="px-12">
                <h1 className="text-4xl font-semibold">{hotel.title}</h1>
                <p className="text-lg">{hotel.location}</p>
              </div>
              <div className="relative">
                <div className="mt-4 flex flex-1 gap-1">
                  <div className="">
                    {hotel.photos?.[0] && (
                      <img
                        src={`http://localhost:3000/uploads/${hotel.photos[0]}`}
                        alt=""
                        className="h-[30.5rem] w-[33rem]"
                      />
                    )}
                  </div>
                  <div className=" flex flex-col gap-2">
                    <div>
                      {hotel.photos?.[1] && (
                        <img
                          src={`http://localhost:3000/uploads/${hotel.photos[1]}`}
                          alt=""
                          className="h-[15rem] w-[20rem]"
                        />
                      )}
                    </div>
                    <div className="">
                      {hotel.photos?.[2] && (
                        <img
                          src={`http://localhost:3000/uploads/${hotel.photos[2]}`}
                          alt=""
                          className="h-[15rem]"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {hotel.amenities && (
                <div className="mt-12 px-12 py-16">
                  <h1 className="text-3xl font-semibold">Amenities</h1>
                  <ul className="list-disc mt-3 flex flex-col gap-4">
                    {hotel.amenities?.map((amenity, index) => (
                      <li className="ml-8" key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hotel.extraInfo?.length > 0 && (
                <div className="mt-12 px-12 py-16">
                  <h1 className="text-3xl font-semibold">Extra Info:</h1>
                  <ul className="list-disc mt-3 flex flex-col gap-4">
                    {hotel.extraInfo[0].split(",").map((info, index) => (
                      <li className="ml-8" key={index}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}

              {hotel.description && (
                <div className="mt-12 px-12 py-16">
                  <h1 className="text-3xl font-semibold">Description:</h1>
                  <p className="mt-3 ml-8">{hotel.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {<DatesForm />}
        <div className="mt-12 px-12"></div>
        <div className="mt-12 px-12">
          <h1 className="text-3xl font-semibold">Rooms available</h1>
          <div className="flex flex-col py-6">
            <RoomTypes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
