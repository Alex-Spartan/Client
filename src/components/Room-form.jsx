import { Bed, DollarSign, Users, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RoomService } from "@/lib/room-service";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

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

const initialRoom = {
  name: "",
  description: "",
  maxOccupancy: 2,
  bedType: "",
  size: 0,
  price: 0,
  images: [],
  amenities: [],
  available: true,
};

const RoomForm = () => {
  const { id } = useParams();
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [newRoom, setNewRoom] = useState(initialRoom);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch rooms for this hotel
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await RoomService.getRooms(id);
        setRooms(data.room || []);
      } catch (err) {
        toast.error("Error fetching rooms");
      }
      setLoading(false);
    };
    if (id) fetchRooms();
  }, [id]);

  // Add room and refresh list
  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.bedType || newRoom.price <= 0) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await RoomService.postRooms(id, [newRoom]);
      toast.success("Room added!");
      setShowRoomForm(false);
      setNewRoom(initialRoom);
      // Refresh rooms
      const data = await RoomService.getRooms(id);
      setRooms(data.room || []);
    } catch (error) {
      toast.error("Failed to add room.");
    }
    setLoading(false);
  };

  const handleSubmitAll = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rooms: createdRooms }),
    });
    const data = await res.json();
    // handle success (e.g., clear createdRooms, show toast, etc.)
    setCreatedRooms([]);
  } catch (err) {
    console.error(err);
    // handle error
  } finally {
    setLoading(false);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Room</CardTitle>
        <CardDescription>
          Fill in the details and click "Add Room" to save to the database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Room Name</Label>
            <Input
              value={newRoom.name}
              onChange={(e) =>
                setNewRoom({ ...newRoom, name: e.target.value })
              }
              placeholder="e.g., Deluxe Suite"
            />
          </div>
          <div className="space-y-2">
            <Label>Bed Type</Label>
            <Select
              value={newRoom.bedType}
              onValueChange={(value) =>
                setNewRoom({ ...newRoom, bedType: value })
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
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
            placeholder="Describe the room..."
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Max Occupancy</Label>
            <Input
              type="number"
              value={newRoom.maxOccupancy}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
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
              value={newRoom.size}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
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
              value={newRoom.price}
              onChange={(e) =>
                setNewRoom({
                  ...newRoom,
                  price: Number.parseFloat(e.target.value),
                })
              }
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Room Amenities</Label>
          <div className="flex flex-wrap gap-2">
            {ROOM_AMENITIES.map((amenity) => (
              <Button
                key={amenity}
                type="button"
                variant={
                  newRoom.amenities?.includes(amenity)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  newRoom.amenities?.includes(amenity)
                    ? setNewRoom({
                        ...newRoom,
                        amenities: newRoom.amenities.filter((a) => a !== amenity),
                      })
                    : setNewRoom({
                        ...newRoom,
                        amenities: [...newRoom.amenities, amenity],
                      })
                }
              >
                {amenity}
              </Button>
            ))}
          </div>
        </div>
        <Button type="button" onClick={handleAddRoom} disabled={loading}>
          {loading ? "Adding..." : "Add Room"}
        </Button>
        {loading && <div>Loading rooms...</div>}
        {rooms.length > 0 && (
          <div className="space-y-4 mt-8">
            <h3 className="font-semibold">Available Rooms</h3>
            {rooms.map((room) => (
              <Card key={room._id || room.id}>
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
                          <DollarSign className="h-3 w-3" />${room.price}/night
                        </span>
                        {room.size > 0 && <span>{room.size} sq ft</span>}
                      </div>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-gray-100 text-xs px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Button type="button" onClick={handleSubmitAll} disabled={loading}>
          {loading ? "Submitting..." : "Submit All Room Types"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomForm;