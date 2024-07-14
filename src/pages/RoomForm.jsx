import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Amenities from "../components/Amenities";
import Photoform from "../components/Photoform";

const RoomForm = () => {
  const { id } = useParams();
  const [photoLink, setPhotoLink] = useState("");
  const [formData, setFormData] = useState({
    roomType: "",
    truePrice: "",
    refundPrice: "",
    photos: [],
    amenities: "",
  });

  const [uploadStatus, setUploadStatus] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const uploadImage = async (e) => {
    if (!photoLink) {
      return alert("Please provide link");
    }
    const { data } = await axios.post("/places/room/image-upload", {
      id: id,
      url: photoLink,
    });
    setFormData((prev) => {
      return {
        ...prev,
        photos: [...prev.photos, data],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/places/rooms/${id}`, formData);
      setUploadStatus(true);
      setTimeout(() => navigate('/account/accomodation'), 2000)
      
    } catch (error) {
      console.error("Error submitting form ", error);
    }
  };

  return (
    <div>
      <Header />
      {uploadStatus && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded relative m-4 md:m-8"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Your room has been added.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col p-20 gap-6">
        <div className="w-full">
          <label className="text-3xl">Room Type:</label>
          <input
            name="roomType"
            className="w-full border border-gray-400 rounded-full p-2"
            type="text"
            value={formData.roomType}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-6 w-full">
          <div className="w-full">
            <label className="text-3xl">Price without Refund</label>
            <input
              name="truePrice"
              className="w-full border border-gray-400 rounded-full p-2"
              type="number"
              value={formData.truePrice}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="text-3xl">Price with Refund</label>
            <input
              name="refundPrice"
              className="w-full border border-gray-400 rounded-full p-2"
              type="number"
              value={formData.refundPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="text-3xl">Photos</label>
          <Photoform photoLink={photoLink} setPhotoLink={setPhotoLink} data={formData} setData={setFormData} uploadByLink={uploadImage} />
        </div>

        <div>
          <label className="text-3xl">Amenities</label>
          <Amenities data={formData} setData={setFormData} />
        </div>
        <div className="mt-1">
          <button
            className="font-semibold bg-cyan-500 px-3 py-2 rounded-xl"
            type="submit"
          >
            Add Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
