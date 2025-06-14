import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useAppStore } from "@/store/useAppStore";

const DatesForm = ({ className }) => {
  const checkIn = useAppStore((s) => s.checkIn);
  const checkOut = useAppStore((s) => s.checkOut);
  const setCheckIn = useAppStore((s) => s.setCheckIn);
  const setCheckOut = useAppStore((s) => s.setCheckOut);

  const [date, setDate] = useState({
    from: checkIn ? new Date(checkIn) : new Date(),
    to: checkOut
      ? new Date(checkOut)
      : new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  // Optional: prevent infinite loop by comparing before setting
  useEffect(() => {
    console.log(date)
    if (date.from && date.to) {
      const fromISO = date.from.toISOString();
      const toISO = date.to.toISOString();

      if (checkIn !== fromISO) setCheckIn(fromISO);
      if (checkOut !== toISO) setCheckOut(toISO);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Check-in / Check-out
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
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
