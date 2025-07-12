import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HotelService } from "@/lib/hotel-service";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import HotelList from "../Home/components/Hotel-List";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const allHotels = await HotelService.getHotels();
        setHotels(allHotels);
        setFilteredHotels(allHotels);
      } catch (error) {
        console.error("Error loading hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = hotels.filter(
      (hotel) =>
        hotel.title.toLowerCase().includes(lowerCaseQuery) ||
        hotel.address.toLowerCase().includes(lowerCaseQuery) ||
        hotel.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHotels(filtered);
  }, [searchQuery, hotels]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Navbar */}
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Discover All Hotels
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Explore our extensive collection of hotels worldwide.
            </p>
          </div>

          {/* Search Input */}
          <Card className="mb-8 border-none shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hotel List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredHotels.length > 0 ? (
            <HotelList hotels={filteredHotels} />
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse other options.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-slate-50 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500">
            © 2024 GoTrip. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
