import { useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "../UserContext";

import { IoCloudUploadOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";

const Photoform = ({ photoLink, setPhotoLink, data, setData, uploadByLink, uploadFromDevice }) => {

  const deletePhoto = (e, link) => {
    e.preventDefault();
    setData((prev) => {
      return {...prev, photos: prev.photos.filter((photo) => photo !== link)};
    });
  };

  const makeCover = (e, link) => {
    e.preventDefault();
    const photoArray = [...data.photos.filter(photo => photo !== link)]
    setData({...data, photos: [link, ...photoArray]});
  }

  return (
    <>
      <div className="flex gap-2 justify-center items-center">
        <input
          type="text"
          value={photoLink || ""}
          onChange={(e) => {
            e.preventDefault();
            setPhotoLink(e.target.value);
          }}
          className="mt-1 border border-gray-400 w-full rounded-full py-1 px-2 md:p-2"
          placeholder="You can put url links for image"
        />
        <button
          type="button"
          onClick={uploadByLink}
          className="text-white bg-[#272D2D] rounded-full py-1 px-2"
        >
          Add photo
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-2 mb-3">
        {data.photos.length > 0 &&
          data.photos.map((link, index) => (
            <div className="relative" key={index}>
              <img
                src={`http://localhost:3000/uploads/${link}`}
                // src={`https://gotripapi.onrender.com/uploads/${link}`}
                width={250}
                height={200}
                className="h-[15rem] rounded-xl object-cover"
                alt="img"
              />
              <button
                onClick={(e) => deletePhoto(e, link)}
                className="absolute text-white bottom-3 right-1/2 p-2 rounded-lg bg-gray-700 bg-opacity-80 md:bottom-2 md:right-3"
              >
                <IoTrashOutline />
              </button>
              <button
                onClick={(e) => makeCover(e, link)}
                className="absolute text-white bottom-3 left-5 p-2 rounded-lg bg-gray-700 bg-opacity-80 md:bottom-2 md:left  -3"
              >
                <IoStarOutline />
              </button>
            </div>
          ))}
      </div>
      {uploadFromDevice && 
      <label className="bg-[#272D2D] w-[9rem] flex items-center gap-2 text-white p-4 mt-2 rounded-lg border-none md:w-[12rem]">
        <IoCloudUploadOutline size={40} className="hidden md:block" /> Upload
        photos from device
        <input type="file" multiple className="hidden" onChange={uploadFromDevice} />
      </label>
      }
    </>
  );
};

export default Photoform;
