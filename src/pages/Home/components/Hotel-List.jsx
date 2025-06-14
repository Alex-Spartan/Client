import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Coffee,
  Heart,
  MapPin,
  Star,
  Utensils,
  Wifi,
} from "lucide-react";

const hotels = [
  {
    id: 1,
    name: "Golden Tulip Goa",
    location: "Candolim, Goa",
    description: "Luxury resort with pool and spa facilities near the beach",
    image: "/placeholder.svg?height=400&width=600",
    price: 90,
    rating: 4.5,
    amenities: ["wifi", "breakfast", "restaurant"],
    discount: "15% OFF",
  },
  {
    id: 2,
    name: "Taj Palace",
    location: "Mumbai, Maharashtra",
    description:
      "Historic 5-star hotel with stunning architecture and sea views",
    image: "/placeholder.svg?height=400&width=600",
    price: 150,
    rating: 4.8,
    amenities: ["wifi", "breakfast", "restaurant"],
  },
  {
    id: 3,
    name: "The Leela Palace",
    location: "Bengaluru, Karnataka",
    description: "Opulent hotel with lush gardens and world-class dining",
    image: "/placeholder.svg?height=400&width=600",
    price: 120,
    rating: 4.7,
    amenities: ["wifi", "breakfast", "restaurant"],
    discount: "10% OFF",
  },
  {
    id: 4,
    name: "Radisson Blu",
    location: "Delhi, NCR",
    description:
      "Modern hotel with excellent business facilities and dining options",
    image: "/placeholder.svg?height=400&width=600",
    price: 85,
    rating: 4.3,
    amenities: ["wifi", "breakfast", "restaurant"],
  },
];

const amenityIcons = {
  wifi: <Wifi className="h-4 w-4" />,
  breakfast: <Coffee className="h-4 w-4" />,
  restaurant: <Utensils className="h-4 w-4" />,
};

export function HotelList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {hotels.map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden">
          <div className="grid md:grid-cols-[2fr_3fr]">
            <div className="relative h-full min-h-[200px]">
              <img
                src={hotel.imageUrl} // replace with your image URL variable or string
                alt="Hotel view" // provide a descriptive alt text
                className="w-full h-64 object-cover rounded-lg"
                loading="lazy"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-rose-500 hover:text-rose-600"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
            <div className="p-6 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600 flex-grow">
                {hotel.description}
              </p>

              <div className="flex items-center gap-2 mt-4">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {amenityIcons[amenity]}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-xl font-bold">${hotel.price}</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default HotelList;
