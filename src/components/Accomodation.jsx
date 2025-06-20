import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Eye,
  Image,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Trash,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { HotelService } from "@/lib/hotel-service";
import { useAppStore } from "@/store/useAppStore";
import { Link, useNavigate } from "react-router-dom";

const Accomodation = () => {
  const user = useAppStore((s) => s.user);
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    fetchHotels();
  }, []);
  
  const fetchHotels = async () => {
    setLoading(true);
    const hotelsData = await HotelService.getHotels();
    if (!hotelsData || hotelsData.error) {
      console.error("Failed to fetch hotels:", hotelsData?.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setHotels(hotelsData);
  };


  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.address
        .toLowerCase()
        .includes(searchQuery.toLowerCase()); // Changed to address
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hotel Management</h1>
          <p className="text-muted-foreground">Manage your hotel listings</p>
        </div>
        <Button asChild>
          <Link to="/account/accomodation/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Hotels
                </p>
                <p className="text-2xl font-bold">{filteredHotels.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <p className="text-2xl font-bold">
                  {(
                    filteredHotels.reduce(
                      (sum, h) => sum + (h.ratings?.average || 0),
                      0
                    ) / (filteredHotels.length || 1)
                  ).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hotels with Images
                </p>
                <p className="text-2xl font-bold">
                  {
                    filteredHotels.filter(
                      (h) => h.photos && h.photos.length > 0
                    ).length
                  }
                </p>
              </div>
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredHotels.map((hotel) => (
            <Card key={hotel._id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden">
                    <img
                      src={
                        hotel.mainImage ||
                        (hotel.photos && hotel.photos[0]) ||
                        "/placeholder.svg?height=128&width=192"
                      }
                      alt={hotel.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{hotel.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{hotel.address}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{hotel.ratings}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/hotel/${hotel._id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/account/accomodation/${hotel._id}`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          // Implement delete hotel logic here
                        }}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredHotels.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No hotels found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Get started by creating your first hotel"}
                  </p>
                  <Button asChild>
                    <Link to="/account/accomodation/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Hotel
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Accomodation;
