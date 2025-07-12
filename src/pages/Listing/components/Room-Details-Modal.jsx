/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Bed,
  Users,
  Maximize,
  Wifi,
  Coffee,
  Tv,
  IndianRupee,
} from "lucide-react";

export function RoomDetailsModal({ room, hotel, open, onOpenChange, onBook }) {
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Wi-Fi": Wifi,
      TV: Tv,
      "Coffee Maker": Coffee,
      "Mini Fridge": Coffee,
    };
    const IconComponent = iconMap[amenity] || Coffee;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Details and images for {room.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Images */}
          {room.images && room.images.length > 0 ? (
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {room.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={img}
                        alt={`${room.name} - Image ${idx + 1}`}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {room.images.length > 1 && (
                  <>
                    <div className="absolute left-20 top-1/2 -translate-y-1/2 z-10">
                      <CarouselPrevious className="bg-white/80 hover:bg-white" />
                    </div>
                    <div className="absolute right-20 top-1/2 -translate-y-1/2 z-10">
                      <CarouselNext className="bg-white/80 hover:bg-white" />
                    </div>
                  </>
                )}
              </Carousel>
            </div>
          ) : (
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}

          {/* Room Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Room Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{room.bedType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Maximum {room.maxOccupancy} guests</span>
                </div>
                {room.size > 0 && (
                  <div className="flex items-center gap-3">
                    <Maximize className="h-5 w-5 text-muted-foreground" />
                    <span>{room.size} square feet</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold text-emerald-600">
                    {room.price} per night
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Room Amenities</h3>
              <div className="grid grid-cols-1 gap-2">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No specific amenities listed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground">{room.description}</p>
            </div>
          )}

          <Separator />

          {/* Hotel Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About {hotel.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">
              {hotel.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 6).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{hotel.amenities.length - 6} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => onBook(room)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Book This Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
