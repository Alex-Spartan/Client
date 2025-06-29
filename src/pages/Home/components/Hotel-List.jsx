/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HotelService } from "@/lib/hotel-service";
import {
  Heart,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Car,
  Dumbbell,
  Waves,
  GlassWater,
  ConciergeBell,
  BriefcaseBusiness,
  Plane,
  PawPrint,
  ThermometerSnowflake,
  ThermometerSun,
  Shirt,
  WashingMachine,
  Vault,
  Refrigerator,
  Building,
  Mountain,
  Bath,
  Tv,
  LampDesk,
  Sofa,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const amenityIcons = {
  "Free WiFi": { icon: Wifi, label: "Free WiFi" },
  "Swimming Pool": { icon: Waves, label: "Swimming Pool" },
  "Fitness Center": { icon: Dumbbell, label: "Fitness Center" },
  Spa: { icon: Coffee, label: "Spa" }, // Using Coffee for Spa as a general relaxation icon
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
  Balcony: { icon: Building, label: "Balcony" }, // Using Building for Balcony as a general architectural feature
  "Ocean View": { icon: Waves, label: "Ocean View" },
  "Mountain View": { icon: Mountain, label: "Mountain View" },
  "City View": { icon: Building, label: "City View" },
  "Private Bathroom": { icon: Bath, label: "Private Bathroom" },
  TV: { icon: Tv, label: "TV" },
  "Coffee Maker": { icon: Coffee, label: "Coffee Maker" },
  Desk: { icon: LampDesk, label: "Desk" },
  Sofa: { icon: Sofa, label: "Sofa" },
}

export function HotelList({ hotels }) {
  

  return (
    <div className="grid gap-8">
      {hotels.map((hotel) => (
        <Card key={hotel._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="grid lg:grid-cols-[400px_1fr] gap-0">
            {/* Image Section */}
            <div className="relative h-64 lg:h-full min-h-[280px]">
              <img src={hotel.photos[0] || "/placeholder.svg"} alt={hotel.title} className="w-full h-full object-cover" />


              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>

              {/* Rating Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  <span className="font-semibold text-sm">{hotel.ratings}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{hotel.title}</h3>
                    {/* <div className="text-right ml-4">
                      <div className="flex items-center gap-2">
                        {hotel.originalPrice > hotel.price && (
                          <span className="text-sm text-muted-foreground line-through">${hotel.originalPrice}</span>
                        )}
                        <span className="text-2xl font-bold text-emerald-600">${hotel.price}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">per night</span>
                    </div> */}
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm">{hotel.address}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed line-clamp-2">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-3">
                  {hotel.amenities.slice(0, 2).map((amenity) => {
                    const amenityData = amenityIcons[amenity]
                    if (!amenityData) return null

                    const IconComponent = amenityData.icon
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full"
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        <span>{amenityData.label}</span>
                      </div>
                    )
                  })}
                  {hotel.amenities.length > 5 && (
                    <div className="flex items-center text-sm text-muted-foreground bg-gray-50 px-3 py-1.5 rounded-full">
                      +{hotel.amenities.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    <span className="font-medium">{hotel.ratings}</span>
                  </div>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Free cancellation</span>
                </div>

                <Button className="bg-emerald-600 hover:bg-emerald-700 px-8" asChild>
                  <Link to={`/hotel/${hotel._id}`}>View Details</Link>
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
