import { useAppStore } from "@/store/useAppStore";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../firebase/firebaseConfig";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  MapPin,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import FormHeader from "./Form-Header";
import { Input } from "./ui/input";
import RoomForm from "./Room-form";

const AccomodationForm = () => {
  const [photoLink, setPhotoLink] = useState("");
  const user = useAppStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [uploadStatus, setUploadStatus] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    photos: [],
    mainImage: "",
    amenities: [],
    phone: "",
    ratings: 4.5,
    extraInfo: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const AMENITIES_OPTIONS = [
    "Free WiFi",
    "Swimming Pool",
    "Fitness Center",
    "Spa",
    "Restaurant",
    "Bar",
    "Room Service",
    "Concierge",
    "Business Center",
    "Parking",
    "Airport Shuttle",
    "Pet Friendly",
    "Air Conditioning",
    "Heating",
    "Laundry Service",
    "Dry Cleaning",
    "Safe",
    "Mini Bar",
    "Balcony",
    "Ocean View",
  ];

  

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
    if (!id) return;
    axios
      .get("/places/accomodation/" + id)
      .then((res) => {
        const { title, address, photos, amenities, extraInfo, phone } =
          res.data;
        setFormData({
          title: title || "",
          address: address || "",
          photos: photos || [],
          amenities: amenities || [],
          extraInfo: extraInfo || "",
          phone: phone || "",
          mainImage: "",
          ratings: 4.5,
        });
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, [id]);

  const uploadByLink = async (e) => {
    e.preventDefault();
    if (!photoLink) {
      toast.error("Please provide a link");
      return;
    }
    try {
      const response = await fetch(photoLink);
      if (!response.ok) {
        throw new Error("Failed to fetch image from link");
      }
      const blob = await response.blob();

      // Create a unique filename
      const fileExt = photoLink.split(".").pop().split(/\#|\?/)[0];
      const fileName = `${user._id}_${Date.now()}.${fileExt}`;

      // Upload to Firebase Storage
      const imageRef = ref(storage, `${fileName}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, url],
        mainImage: prev.photos.length === 0 ? url : prev.mainImage,
      }));
      setPhotoLink("");
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  // Upload image from device
  const uploadFromDevice = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No file selected");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const imageRef = ref(storage, `${files[i].name}`);
      let url = "";
      try {
        await uploadBytes(imageRef, files[i]).then(async (snapshot) => {
          url = await getDownloadURL(snapshot.ref);
        });
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, url],
        }));
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error("Error uploading file");
      }
    }
  };


  

  const addAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);
    try {
      if (!formData.title || !formData.address) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }
      if (!id) {
        const { message, error } = await axios.post(
          "/places/accomodation",
          formData
        );
        if (error) {
          toast.error(message);
          setIsLoading(false);
          return;
        }
        setUploadStatus(true);
        toast.success("Hotel added");
        setTimeout(() => navigate("/account/accomodation"), 1500);
      } else {
        await axios.put("/places/accomodation/" + id, formData);
        setUploadStatus(true);
        toast.success("Hotel updated!");
        setTimeout(() => navigate("/account/accomodation"), 1500);
      }
    } catch (err) {
      toast.error("Failed to save hotel");
    }
    setIsLoading(false);
  };

  return (
    <>
      <FormHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {id ? "Edit Hotel" : "Create New Hotel"}
          </h1>
          <p className="text-muted-foreground">
            {id ? "Edit your hotel details" : "Add a new hotel to the platform"}
          </p>
        </div>

        {uploadStatus && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded relative m-4 md:m-8"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              {" "}
              Your accommodation has been {id ? "updated" : "added"}.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the hotel&apos;s basic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Hotel Name *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter hotel name"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Full street address, city, state, country, ZIP code"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Images</CardTitle>
                  <CardDescription>
                    Upload high-quality images of your hotel (first image will
                    be the main image)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={photoLink}
                        onChange={(e) => setPhotoLink(e.target.value)}
                        placeholder="Paste image URL and click Add"
                      />
                      <Button type="button" onClick={uploadByLink}>
                        Add
                      </Button>
                    </div>
                    <div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={uploadFromDevice}
                        className="file:cursor-pointer file:rounded file:border-0 file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.photos &&
                        formData.photos.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`hotel-img-${idx}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                  <CardDescription>
                    Select or add hotel amenities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <Button
                        key={amenity}
                        type="button"
                        variant={
                          formData.amenities.includes(amenity)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          formData.amenities.includes(amenity)
                            ? removeAmenity(amenity)
                            : addAmenity(amenity)
                        }
                      >
                        {amenity}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <Input
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Add custom amenity"
                      />
                      <Button
                        type="button"
                        onClick={() => addAmenity(newAmenity)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {formData.amenities && formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="gap-1"
                        >
                          {amenity}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeAmenity(amenity)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <RoomForm />

              {/* Extra Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Extra Info</CardTitle>
                  <CardDescription>
                    Let your customer know your dos and don&apos;ts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.extraInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, extraInfo: e.target.value })
                    }
                    placeholder="Eg. Cancellation till check-in available"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91 12345 67890"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {id ? "Updating Hotel..." : "Creating Hotel..."}
                        </>
                      ) : id ? (
                        "Update Hotel"
                      ) : (
                        "Create Hotel"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AccomodationForm;
