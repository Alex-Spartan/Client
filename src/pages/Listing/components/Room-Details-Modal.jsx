/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bed, Users, Maximize, DollarSign, ChevronLeft, ChevronRight, Wifi, Coffee, Tv } from "lucide-react"


export function RoomDetailsModal({ room, hotel, open, onOpenChange, onBook }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
    }
  }

  const prevImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)
    }
  }

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Wi-Fi": Wifi,
      TV: Tv,
      "Coffee Maker": Coffee,
      "Mini Fridge": Coffee,
    }
    const IconComponent = iconMap[amenity] || Coffee
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Images */}
          {room.images && room.images.length > 0 ? (
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <img
                src={room.images[currentImageIndex] || "/placeholder.svg?height=320&width=600"}
                alt={`${room.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {room.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
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
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold text-emerald-600">{room.price} per night</span>
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
                  <p className="text-muted-foreground text-sm">No specific amenities listed</p>
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
            <p className="text-muted-foreground text-sm mb-3">{hotel.description}</p>
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
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={() => onBook(room)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Book This Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
