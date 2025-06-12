import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/Header";
import RoomTypes from "./RoomTypes";
import DatesForm from "../Home/DatesForm";
import Footer from "../../components/Footer";
import PageWrapper from "../../components/PageWrapper";

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
      <PageWrapper className="bg-[#FBFBFF]">
        <div className="flex justify-center">
          <div className="m-3 md:m-2 flex-1">
            <div className="flex flex-col-reverse gap-6 items-center md:flex-row md:justify-between">
              <div className="md:px-12">
                <h1 className="text-2xl md:text-4xl font-semibold">{hotel.title}</h1>
                <p className="text-lg">{hotel.location}</p>
              </div>
              <div className="relative">
                <div className="mt-4 flex flex-1 gap-1">
                  <div className="">
                    {hotel.photos?.[0] && (
                      <img
                        src={hotel.photos[0]}
                        // src="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        // src={`https://gotripapi.onrender.com/uploads/${hotel.photos[0]}`}
                        alt=""
                        className="w-[22rem] h-[15rem] md:h-[30.5rem] md:w-[33rem]"
                        />
                      )}
                  </div>
                  <div className=" flex flex-col gap-2">
                    <div className="hidden md:block">
                      {hotel.photos?.[1] && (
                        <img
                        src={hotel.photos[1]}
                        // src={`https://gotripapi.onrender.com/uploads/${hotel.photos[1]}`}
                        alt=""
                        className="h-[15rem] w-[20rem]"
                        />
                      )}
                    </div>
                    <div className="hidden md:block">
                      {hotel.photos?.[2] && (
                        <img
                        src={hotel.photos[2]}
                        // src={`https://gotripapi.onrender.com/uploads/${hotel.photos[2]}`}
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

            {hotel.description && (
                <div className="flex flex-col items-center px-2 py-8 md:block mt-2 md:px-12 md:py-16">
                  <h1 className="text-3xl font-semibold">Description</h1>
                  <p className="mt-3 ml-8">{hotel.description}</p>
                  <hr />
                </div>
                
              )}


              {hotel.amenities && (
                <div className="flex flex-col items-center px-2 py-8 md:block mt-2 md:px-12 md:py-16">
                  <h1 className="text-3xl font-semibold">Amenities</h1>
                  <ul className="list-disc mt-3 flex flex-col gap-4">
                    {hotel.amenities?.map((amenity, index) => (
                      <li className="ml-8" key={index}>{amenity}</li>
                    ))}
                  </ul>
                  <hr />
                </div>
                
              )}
              
              {hotel.extraInfo?.length > 0 && (
                <div className="flex flex-col items-center px-2 py-8 md:block mt-2 md:px-12 md:py-16">
                  <h1 className="text-3xl font-semibold">Extra Info</h1>
                  <ul className="list-disc mt-3 flex flex-col gap-4">
                    {hotel.extraInfo[0].split(",").map((info, index) => (
                      <li className="ml-8" key={index}>{info}</li>
                    ))}
                  </ul>
                  <hr />
                </div>
                
              )}
            </div>
          </div>
        </div>

        {<DatesForm />}
        <div className="mt-2 md:px-12"></div>
        <div className="mt-2 md:px-12">
          <h1 className="text-3xl font-semibold">Rooms available</h1>
          <div className="flex flex-col py-6">
            <RoomTypes />
          </div>
        </div>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default ListingPage;
