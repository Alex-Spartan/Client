import { useAppStore } from "@/store/useAppStore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Plus,
  X,
  DollarSign,
  Bed,
  Users,
  Loader2,
} from "lucide-react";
import { storage } from "@/firebase/firebaseConfig";
import FormHeader from "@/components/Form-Header";
import { HotelService } from "@/lib/hotel-service";

const AccomodationForm = () => {
  const [photoLink, setPhotoLink] = useState("");
  const user = useAppStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [uploadStatus, setUploadStatus] = useState(false);
  const [roomCheckMode, setRoomCheckMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    photos: [],
    mainImage: "",
    amenities: [],
    phone: "",
    ratings: 4.5,
    extraInfo: "",
    roomTypes: [],
  });

  const [newRoomType, setNewRoomType] = useState({
    id: "",
    name: "",
    maxOccupancy: 2,
    bedType: "",
    size: 35,
    price: 0,
    images: [],
    amenities: [],
    available: true,
  });
  const [showRoomForm, setShowRoomForm] = useState(false);

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

  const ROOM_AMENITIES = [
    "Private Bathroom",
    "Air Conditioning",
    "TV",
    "Mini Fridge",
    "Coffee Maker",
    "Safe",
    "Balcony",
    "Ocean View",
    "Mountain View",
    "City View",
    "Wi-Fi",
    "Desk",
    "Sofa",
    "Bathtub",
    "Shower",
  ];

  const BED_TYPES = [
    "Single Bed",
    "Double Bed",
    "Queen Bed",
    "King Bed",
    "Twin Beds",
    "Bunk Bed",
    "Sofa Bed",
  ];


  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
    if (!id) return;
    HotelService.getHotels(id)
      .then((data) => {
        if (data) {
          setFormData({
            ...data,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching hotel data:", error);
        toast.error("Failed to load hotel data");
      });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (formData.roomTypes && formData.roomTypes.length > 0) {
      const roomCheckMode = formData.roomTypes.some(
        (room) => room.images.length === 0
      )
        ? "incomplete"
        : "complete";
      setRoomCheckMode(roomCheckMode);
    }
  }, [formData.roomTypes]);

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
  const uploadHotelPics = async (e) => {
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

  const uploadRoomPics = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No file selected");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const imageRef = ref(storage, `rooms/${files[i].name}`);
      let url = "";
      try {
        await uploadBytes(imageRef, files[i]).then(async (snapshot) => {
          url = await getDownloadURL(snapshot.ref);
        });
        setNewRoomType((prev) => ({
          ...prev,
          images: [...prev.images, url],
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

  const addRoomType = () => {
    if (newRoomType.name && newRoomType.bedType && newRoomType.price > 0) {
      const roomType = {
        ...newRoomType,
        id: Date.now().toString(),
      };
      setFormData({
        ...formData,
        roomTypes: [...(formData.roomTypes || []), roomType],
      });
      setNewRoomType({
        id: "",
        name: "",
        maxOccupancy: 2,
        bedType: "",
        size: 35,
        price: 0,
        images: [],
        amenities: [],
        available: true,
      });
      setShowRoomForm(false);
    }
  };

  const removeRoomType = (roomId) => {
    setFormData({
      ...formData,
      roomTypes: formData.roomTypes?.filter((room) => room.id !== roomId) || [],
    });
  };

  const addRoomAmenity = (amenity) => {
    if (amenity && !newRoomType.amenities?.includes(amenity)) {
      setNewRoomType({
        ...newRoomType,
        amenities: [...(newRoomType.amenities || []), amenity],
      });
    }
  };

  const removeRoomAmenity = (amenity) => {
    setNewRoomType({
      ...newRoomType,
      amenities: newRoomType.amenities?.filter((a) => a !== amenity) || [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title || !formData.address) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }
      if (!id) {
        const { message, error } = await HotelService.createHotel(formData);
        if (error) {
          toast.error(message);
          setIsLoading(false);
          return;
        }
        setUploadStatus(true);
        toast.success("Hotel added");
        setTimeout(() => navigate("/account/accomodation"), 1500);
      } else {
        await HotelService.updateHotel(id, formData);
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

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>
                    Provide a detailed description of your hotel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your hotel, its features, and what makes it unique"
                    rows={4}
                  />
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
                        onChange={uploadHotelPics}
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

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Room Types</CardTitle>
                      <CardDescription>
                        Add different room types and their details
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={() => setShowRoomForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Room Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showRoomForm && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">New Room Type</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Room Name</Label>
                            <Input
                              value={newRoomType.name}
                              onChange={(e) =>
                                setNewRoomType({
                                  ...newRoomType,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Deluxe Suite"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bed Type</Label>
                            <Select
                              value={newRoomType.bedType}
                              onValueChange={(value) =>
                                setNewRoomType({
                                  ...newRoomType,
                                  bedType: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select bed type" />
                              </SelectTrigger>
                              <SelectContent>
                                {BED_TYPES.map((bed) => (
                                  <SelectItem key={bed} value={bed}>
                                    {bed}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Max Occupancy</Label>
                            <Input
                              type="number"
                              value={newRoomType.maxOccupancy}
                              onChange={(e) =>
                                setNewRoomType({
                                  ...newRoomType,
                                  maxOccupancy: Number.parseInt(e.target.value),
                                })
                              }
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Size (sq ft)</Label>
                            <Input
                              type="number"
                              value={newRoomType.size}
                              onChange={(e) =>
                                setNewRoomType({
                                  ...newRoomType,
                                  size: Number.parseInt(e.target.value),
                                })
                              }
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Price per Night
                            </Label>
                            <Input
                              type="number"
                              value={newRoomType.price}
                              onChange={(e) =>
                                setNewRoomType({
                                  ...newRoomType,
                                  price: Number.parseFloat(e.target.value),
                                })
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Upload room photos</Label>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={uploadRoomPics}
                            className="file:cursor-pointer file:rounded file:border-0 file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newRoomType.images &&
                            newRoomType.images.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`hotel-img-${idx}`}
                                className="w-24 h-24 object-cover rounded"
                              />
                            ))}
                        </div>

                        <div className="space-y-2">
                          <Label>Room Amenities</Label>
                          <div className="flex flex-wrap gap-2">
                            {ROOM_AMENITIES.map((amenity) => (
                              <Button
                                key={amenity}
                                type="button"
                                variant={
                                  newRoomType.amenities?.includes(amenity)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  newRoomType.amenities?.includes(amenity)
                                    ? removeRoomAmenity(amenity)
                                    : addRoomAmenity(amenity)
                                }
                              >
                                {amenity}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button type="button" onClick={addRoomType}>
                            Add Room Type
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowRoomForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {formData.roomTypes && formData.roomTypes.length > 0 && (
                    <div className="space-y-4">
                      {formData.roomTypes.map((room) => (
                        <Card key={room.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{room.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {room.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    {room.bedType}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Max {room.maxOccupancy}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />$
                                    {room.price}/night
                                  </span>
                                  {room.size > 0 && (
                                    <span>{room.size} sq ft</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeRoomType(room.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" disabled={isLoading}>
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
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {roomCheckMode === false
                              ? "No Rooms Added"
                              : "Submit Hotel with Rooms?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {roomCheckMode === false
                              ? "You haven’t added any rooms. Do you want to continue without adding rooms?"
                              : "You have added rooms. Do you want to proceed with submitting the hotel and these rooms?"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild disabled={isLoading}>
                            <Button onClick={handleSubmit}>Submit</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
