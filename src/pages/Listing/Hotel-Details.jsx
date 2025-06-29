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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { HotelService } from "@/lib/hotel-service";
import {
  ArrowLeft,
  Bath,
  Bed,
  BriefcaseBusiness,
  Building,
  Calendar,
  Car,
  Coffee,
  ConciergeBell,
  Dumbbell,
  GlassWater,
  Heart,
  IndianRupee,
  LampDesk,
  Loader2,
  MapPin,
  Maximize,
  Mountain,
  PawPrint,
  Phone,
  Plane,
  Refrigerator,
  Shirt,
  Sofa,
  ThermometerSnowflake,
  ThermometerSun,
  Tv,
  Users,
  Utensils,
  Vault,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "../Home/components/Date-Picker";
import { RoomDetailsModal } from "./components/Room-Details-Modal";

const amenityIcons = {
  "Free WiFi": { icon: Wifi, label: "Free WiFi" },
  "Swimming Pool": { icon: Waves, label: "Swimming Pool" },
  "Fitness Center": { icon: Dumbbell, label: "Fitness Center" },
  Spa: { icon: Coffee, label: "Spa" },
  Restaurant: { icon: Utensils, label: "Restaurant" },
  Bar: { icon: GlassWater, label: "Bar" },
  "Room Service": { icon: ConciergeBell, label: "Room Service" },
  Concierge: { icon: ConciergeBell, label: "Concierge" },
  "Business Center": { icon: BriefcaseBusiness, label: "Business Center" },
  Parking: { icon: Car, label: "Parking" },
  "Airport Shuttle": { icon: Plane, label: "Airport Shuttle" },
  "Pet Friendly": { icon: PawPrint, label: "Pet Friendly" },
  "Air Conditioning": { icon: ThermometerSnowflake, label: "Air Conditioning" },
  Heating: { icon: ThermometerSun, label: "Heating" },
  "Laundry Service": { icon: WashingMachine, label: "Laundry Service" },
  "Dry Cleaning": { icon: Shirt, label: "Dry Cleaning" },
  Safe: { icon: Vault, label: "Safe" },
  "Mini Bar": { icon: Refrigerator, label: "Mini Bar" },
  Balcony: { icon: Building, label: "Balcony" },
  "Ocean View": { icon: Waves, label: "Ocean View" },
  "Mountain View": { icon: Mountain, label: "Mountain View" },
  "City View": { icon: Building, label: "City View" },
  "Private Bathroom": { icon: Bath, label: "Private Bathroom" },
  TV: { icon: Tv, label: "TV" },
  "Coffee Maker": { icon: Coffee, label: "Coffee Maker" },
  Desk: { icon: LampDesk, label: "Desk" },
  Sofa: { icon: Sofa, label: "Sofa" },
};

function getAmenityIcon(amenity) {
  const amenityData = amenityIcons[amenity];
  const IconComponent = amenityData ? amenityData.icon : Coffee;
  return <IconComponent className="h-4 w-4" />;
}

export default function HotelDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToaster();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });

  useEffect(() => {
    if (params.id) {
      loadHotel(params.id);
    }
  }, [params.id]);

  const loadHotel = async (hotelId) => {
    try {
      setLoading(true);
      const hotelData = await HotelService.getHotels(hotelId);
      setHotel(hotelData);
    } catch (error) {
      console.error("Error loading hotel:", error);
      toast.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = () => {
    setIsInWishlistState((prev) => !prev);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleBookRoom = (room) => {
    navigate(`/hotel/booking?hotelId=${hotel._id}&roomId=${room._id}`, {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hotel photos */}
        <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
          {hotel.photos && hotel.photos.length > 0 ? (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {hotel.photos.map((photo, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative h-96 md:h-[500px] w-full overflow-hidden rounded-xl">
                      <img
                        src={photo}
                        alt={hotel.title}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute left-20 top-1/2 -translate-y-1/2 z-10">
                <CarouselPrevious className="bg-white/80 hover:bg-white" />
              </div>
              <div className="absolute right-20 top-1/2 -translate-y-1/2 z-10">
                <CarouselNext className="bg-white/80 hover:bg-white" />
              </div>
            </Carousel>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{hotel.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{hotel.ratings}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{hotel.phone}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isInWishlistState ? "default" : "outline"}
                    size="icon"
                    onClick={isInWishlist}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlistState ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Hotel Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
                <CardDescription>
                  Choose from our selection of comfortable rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
                  <div className="space-y-4">
                    {hotel.roomTypes.map((room) => (
                      <Card
                        key={room._id}
                        className="border-l-4 border-l-emerald-500"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold mb-2">
                                {room.name}
                              </h4>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Bed className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {room.bedType}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Max {room.maxOccupancy}
                                  </span>
                                </div>
                                {room.size > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Maximize className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {room.size} sq ft
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-semibold">
                                    {room.price}/night
                                  </span>
                                </div>
                              </div>

                              {room.amenities && room.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {room.amenities.slice(0, 4).map((amenity) => (
                                    <Badge
                                      key={amenity}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {room.amenities.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{room.amenities.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoomSelect(room)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleBookRoom(room)}
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No rooms available at this time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
                <CardDescription>Select dates and guests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Check-in / Check-out
                  </label>
                  <DatePicker />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Guests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Adults
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        onSelect={(e) =>
                          setGuests({ ...guests, adults: e.target.value })
                        }
                        defaultValue={guests.adults}
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4 Adults</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Children
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        onSelect={(e) =>
                          setGuests({ ...guests, children: e.target.value })
                        }
                        defaultValue={guests.children}
                      >
                        <option value="0">0 Children</option>
                        <option value="1">1 Child</option>
                        <option value="2">2 Children</option>
                        <option value="3">3 Children</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Starting from</span>
                    <span className="font-semibold">
                      $
                      {Math.min(
                        ...(hotel.roomTypes?.map((r) => r.price) || [0])
                      )}
                      /night
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    * Final price will depend on room selection and dates
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Check Availability
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          hotel={hotel}
          open={showRoomModal}
          onOpenChange={setShowRoomModal}
          onBook={() => handleBookRoom(selectedRoom)}
        />
      )}
    </div>
  );
}
