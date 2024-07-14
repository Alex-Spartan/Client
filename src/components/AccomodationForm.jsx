import { useContext, useEffect, useState } from "react";

import Amenities from "./Amenities";
import Photoform from "./Photoform";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useNavigate, useParams } from "react-router-dom";

const AccomodationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    photos: [],
    amenities: [],
    extraInfo: [],
  });
  const [photoLink, setPhotoLink] = useState("");

  const uploadByLink = async (e) => {
    e.preventDefault();
    if (!photoLink) {
      return alert("Please provide link");
    }
    const { data } = await axios.post("/places/image-upload", {
      id: user._id,
      url: photoLink,
    });
    setFormData((prev) => {
      return {...prev, photos: [...prev.photos, data]};
    })
    e.target.value = "";
  };

  const uploadFromDevice = (e) => {
    e.preventDefault();
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    data.append("id", user._id);
    axios
      .post("/places/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((res) => {
        const { data } = res;
        setData((prev) => {
          return {...prev, photos: [...prev.photos, data]};
        })
      })
      .catch((err) => console.log(err));
  };

  const [uploadStatus, setUploadStatus] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/places/accomodation/" + id)
      .then((res) => {
        const { title, location, description, photos, amenities, extraInfo } =
          res.data;
        setFormData({
          title,
          location,
          description,
          photos,
          amenities,
          extraInfo,
          uploadStatus: formData.uploadStatus,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const setValue = (e, setData = setFormData) => {
    e.preventDefault();
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  const preInput = (title, description) => {
    return (
      <>
        <h1 className="text-xl font-semibold md:text-3xl md:font-normal">
          {title}
        </h1>
        <p className="text-sm md:text-base">{description}</p>
      </>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!id) {
        console.log(formData);
        await axios.post("/places/accomodation", formData)
        .then((res) => {
          setUploadStatus(true);
          setTimeout(() => navigate("/account/accomodation"), 3000);
        });
      } else {
        axios.put("/places/accomodation/" + id, formData)
        .then((res) => {
          setUploadStatus(true);
          setTimeout(() => navigate("/account/accomodation"), 3000);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {uploadStatus && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded relative m-4 md:m-8"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Your accomodation has been added.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="m-4 md:m-8">
          {preInput("Title", "Let your Hotel be famous. Put it's name")}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setValue(e)}
            className="mt-1 border border-gray-400 w-full rounded-full py-1 px-2 md:p-2"
          />
        </div>

        <div className="m-4 md:m-8">
          {preInput("Location", "Where can we find this wonderful place?")}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => setValue(e)}
            className="mt-1 border border-gray-400 w-full rounded-full py-1 px-2 md:p-2"
          />
        </div>

        <div className="m-4 md:m-8">
          {preInput("Description", "Describe your heaven")}
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => setValue(e)}
            className="mt-1 h-[6rem] border border-gray-400 w-full rounded-lg py-1 px-2 md:p-2"
          />
        </div>

        <div className="m-4 md:m-8">
          {preInput("Photos", "Let our eyes be astonished with it.")}
          <Photoform photoLink={photoLink} setPhotoLink={setPhotoLink} data={formData} setData={setFormData} uploadByLink={uploadByLink} uploadFromDevice={uploadFromDevice}/>
        </div>

        <div className="m-4 md:m-8">
          {preInput("Amenities", "Show your services!")}
          <Amenities data={formData} setData={setFormData} />
        </div>

        <div className="m-4 md:m-8">
          {preInput("Extra info", "Let your customer know your dos and donts")}
          <p className="text-sm md:text-base"></p>
          <textarea
            type="text"
            name="extraInfo"
            value={formData.extraInfo}
            onChange={(e) => {
              setFormData({ ...formData, extraInfo: e.target.value });
            }}
            className="mt-1 h-[6rem] border border-gray-400 w-full rounded-lg py-1 px-2 md:p-2"
            placeholder="Eg. Cancellation till check-in available"
          />
        </div>

        <div className="m-4 md:m-8">
          <button
            type="submit"
            className="mt-4 p-1 w-full border-none text-white bg-[#272D2D] rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AccomodationForm;
