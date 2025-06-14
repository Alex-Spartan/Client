import { useContext, useState } from "react";
import { UserContext } from "../../../UserContext";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const DatesForm = ({ className }) => {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    rooms,
    setRooms,
    setDatefns,
  } = useContext(UserContext);
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })

  return (
    // <div className="my-12 flex flex-col justify-center w-[80%] md:w-1/2 mx-auto">
    //   <div className="text-xl text-center md:text-3xl font-bold">
    //     <h1>Choose your stay</h1>
    //   </div>
    //   <div className="mt-4">
    //     <form className="py-6 border-gray-400 border-2 shadow-lg rounded-lg flex justify-center items-center">
    //       <div className="flex flex-col gap-8 md:flex-row md:gap-12 justify-center items-center p-8">
    //         <div className="flex justify-center">
    //           <div className="border-l border-t border-b border-black p-1 rounded-r-none rounded-l-md font-semibold">
    //             <input
    //               value={checkIn}
    //               className="p-1 border-r border-gray-400 outline-none"
    //               type="date"
    //               name="check-in"
    //               onChange={(e) => setCheckIn(e.target.value)}
    //               min={new Date().toISOString().split("T")[0]}
    //             />
    //           </div>
    //           <div className="border-r border-t border-b border-black p-1 rounded-l-none rounded-b-md rounded-r-md font-semibold">
    //             <input
    //               value={checkOut}
    //               className="p-1 outline-none"
    //               type="date"
    //               name="check-in"
    //               onChange={(e) => {
    //                 setCheckOut(e.target.value);
    //                 setDatefns(true);
    //               }}
    //               min={
    //                 checkIn ? checkIn : new Date().toISOString().split("T")[0]
    //               }
    //             />
    //           </div>
    //         </div>
    //         <div className="mx-2 border-black border-none p-1">
    //           <select
    //             className="p-2 border-black border rounded-lg font-semibold"
    //             placeholder="members"
    //             value={rooms}
    //             onChange={(e) => setRooms(e.target.value)}
    //           >
    //             <option className="border-none p-2" value="1">
    //               1 guest, 1 Room
    //             </option>
    //             <option className="border-none p-2" value="1">
    //               2 guests, 1 Room
    //             </option>
    //             <option className="border-none p-2" value="2">
    //               4 guests, 2 Room
    //             </option>
    //           </select>
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <div className={cn("grid gap-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Check-in / Check-out
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatesForm;
