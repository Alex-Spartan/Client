import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import { useEffect, useState } from "react";

const HotelCarousel = () => {
  const [accomodation, setAccomodation] = useState([]);
  useEffect(() => {
    const fetchAccomodation = async () => {
      const response = await axios.get("/places/accomodation");
      setAccomodation(response.data);
    };
    fetchAccomodation();
  }, [setAccomodation]);

  const featuredDestinations = [
    {
      id: 1,
      name: "Maldives Paradise",
      description: "Luxury overwater villas with stunning ocean views",
      image: "/placeholder.svg?height=600&width=1200",
      price: "From $299/night",
    },
    {
      id: 2,
      name: "Swiss Alps Retreat",
      description: "Mountain chalets with breathtaking panoramic views",
      image: "/placeholder.svg?height=600&width=1200",
      price: "From $199/night",
    },
    {
      id: 3,
      name: "Santorini Getaway",
      description: "Cliffside suites overlooking the Aegean Sea",
      image: "/placeholder.svg?height=600&width=1200",
      price: "From $249/night",
    },
    {
      id: 4,
      name: "Bali Beach Resort",
      description: "Tropical paradise with private beach access",
      image: "/placeholder.svg?height=600&width=1200",
      price: "From $179/night",
    },
  ];
  return (
    <Carousel className="w-full flex flex-col items-center md:block gap-10">
      <CarouselContent>
        {featuredDestinations.map((destination) => (
          <CarouselItem key={destination.id}>
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl">
              <img
                src={destination.image}
                alt="Description of the image" 
                className="w-full h-auto rounded-lg object-cover" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2">
                  {destination.name}
                </h3>
                <p className="text-lg md:text-xl mb-4 max-w-md">
                  {destination.description}
                </p>
                <div className="flex items-center justify-between max-w-md">
                  <span className="text-xl font-semibold">
                    {destination.price}
                  </span>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    {/* add link to booking */}
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="relative md:absolute md:right-28 md:bottom-8 flex flex-row gap-2">
        <CarouselPrevious className="relative bg-white/30 hover:bg-white/50 border-none" />
        <CarouselNext className="relative bg-white/30 hover:bg-white/50 border-none" />
      </div>
    </Carousel>
  );
};

export default HotelCarousel;
