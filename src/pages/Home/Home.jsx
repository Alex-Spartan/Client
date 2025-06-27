import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HotelCarousel from "./components/Hotel-Carousel";
import HotelList from "./components/Hotel-List";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "./components/Date-Picker";

const Home = () => {

  const [accomodation, setAccomodation] = useState([]);
  useEffect(() => {
    const fetchAccomodation = async () => {
      const response = await axios.get("/places/accomodation");
      setAccomodation(response.data.slice(0, 6));
    };
    fetchAccomodation();
  }, [setAccomodation]);

  return (
    <div className="min-h-screen">
      <Header />
        <section className="w-full py-6 md:py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
            <HotelCarousel />
          </div>
        </section>

        <section className="w-full py-6 md:py-12 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find Your Perfect Stay
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Search from thousands of hotels worldwide with our easy-to-use
                booking system.
              </p>
            </div>

            <Card className="mt-8 border-none shadow-lg">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_1fr_auto] relative">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Destination
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Where are you going?"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <DatePicker />

                    <Button
                      size="lg"
                      className="md:relative bg-emerald-600 hover:bg-emerald-700 right-1 -bottom-7"
                    >
                      Search Hotels
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Top Hotels</h2>
            <p className="text-gray-500">Discover our most popular destinations</p>
          </div>
          <HotelList hotels={accomodation} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
