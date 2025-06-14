import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PageWrapper from "../../components/PageWrapper";
import DatesForm from "./components/DatesForm";
import HotelCarousel from "./components/Hotel-Carousel";
import HotelList from "./components/Hotel-List";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const [accomodation, setAccomodation] = useState([]);
  useEffect(() => {
    const fetchAccomodation = async () => {
      const response = await axios.get("/places/accomodation");
      setAccomodation(response.data);
    };
    fetchAccomodation();
  }, [setAccomodation]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageWrapper className="bg-[#FBFBFF]">
        <section className="w-full py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <HotelCarousel />
          </div>
        </section>

        <section className="w-full py-6 md:py-12 bg-slate-50">
          <div className="container px-4 md:px-6">
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
                    <DatesForm />

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

        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Top hotels</h1>
          <p className="text-lg">The best locations are here</p>
        </div>
        <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Top Hotels</h2>
            <p className="text-gray-500">Discover our most popular destinations</p>
          </div>

          <HotelList />
        </div>
      </section>
      
        {/* <div>
          {accomodation &&
            accomodation.map((acc) => (
              <div key={acc._id}>
                <div>
                  <div className="my-6 p-4 md:grid md:grid-cols-5 hover:border-blue-950 hover:border-2 md:border-gray-700 border-2 rounded-xl">
                    <div className="md:col-span-1">
                      <Link to={`/hotel/${acc._id}`}>
                        <img
                          src={acc.photos[0]}
                          alt=""
                          className="md:w-[15rem] md:h-[18rem] rounded-lg"
                        />
                      </Link>
                    </div>
                    <div className="md:col-span-3 md:flex md:flex-col md:justify-around">
                      <div className="mt-2">
                        <Link to={`/hotel/${acc._id}`}>
                          <p className="text-xl font-semibold">{acc.title}</p>
                          <p>{acc.location}</p>
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <p>Shit offer 1</p>
                        <p>Shit offer 2</p>
                        <p>Shit offer 3</p>
                      </div>
                    </div>
                    <div className="mt-2 md:border-gray-700 md:border-l md:col-span-1 md:text-center">
                      <p>Starting from $90</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div> */}
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Home;
