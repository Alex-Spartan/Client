import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HotelCarousel = () => {

  const featuredDestinations = [
    {
      id: 1,
      name: "Maldives Paradise",
      description: "Luxury overwater villas with stunning ocean views",
      image:
        "https://www.budgetmaldives.com/wp-content/uploads/2020/05/Paradise-Island-Ocean-Suite-Exterior-01.jpg",
      price: "From ₹7099/night",
    },
    {
      id: 2,
      name: "Manali Mountain Lodge",
      description: "Cozy wooden cottages nestled in the Himalayas",
      image: "https://r1imghtlak.mmtcdn.com/573d7fe9-3c16-461e-b1b1-c5c89c816074.jpg",
      price: "From ₹3,499/night",
    },
    {
      id: 3,
      name: "Udaipur Heritage Haveli",
      description: "Royal stay with lake views and traditional decor",
      image: "https://www.onceinalifetimejourney.com/wp-content/uploads/2017/07/image5-1.png",
      price: "From ₹6,000/night",
    },
    {
      id: 4,
      name: "Kerala Backwater Retreat",
      description: "Houseboats and cottages amidst lush backwaters",
      image: "https://images.luxuryescapes.com/q_auto:best,dpr_2.0/tiv6vwcrct0kumexm8tm",
      price: "From ₹4,200/night",
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
