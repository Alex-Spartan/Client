import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { BookingService } from "@/lib/booking-service";

const BookingList = () => {
  const user = useAppStore((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const bookingsData = await BookingService.getBookings(user._id);
        if (bookingsData.error) {
          console.log("Error fetching bookings:", bookingsData.message);
          return;
        }
        setBookings(bookingsData.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
    setBookingsLoading(false);
  }, [user]);

  // const { wishlist, loading: wishlistLoading } = useWishlist()

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.displayName || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Manage your bookings and favorite hotels
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking History
            </CardTitle>
            <CardDescription>Your recent hotel reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {booking.hotelName}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(booking.checkInDate).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              booking.checkOutDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ${booking.totalAmount}
                        </p>
                        <Badge
                          className={`${getStatusColor(
                            booking.status
                          )} border-0 mt-1`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {booking.guests.adults} Adult
                        {booking.guests.adults > 1 ? "s" : ""}
                        {booking.guests.children > 0 &&
                          `, ${booking.guests.children} Child${
                            booking.guests.children > 1 ? "ren" : ""
                          }`}
                      </span>
                      <span>
                        {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}
                      </span>
                      {booking.bookingReference && (
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {booking.bookingReference}
                        </span>
                      )}
                    </div>

                    {booking.status === "confirmed" &&
                      new Date(booking.checkInDate) > new Date() && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">
                            <strong>Upcoming Trip:</strong> Check-in in{" "}
                            {Math.ceil(
                              (new Date(booking.checkInDate).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </p>
                        </div>
                      )}
                  </div>
                ))}

                {bookings.length > 5 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/bookings">
                      View All Bookings ({bookings.length})
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring and book your first trip!
                </p>
                <Button asChild>
                  <Link href="/">Explore Hotels</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Hotels */}
        {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorite Hotels
              </CardTitle>
              <CardDescription>Your saved hotels and destinations</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlistLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : wishlist.length > 0 ? (
                <div className="space-y-4">
                  {wishlist.slice(0, 5).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {item.hotelImage && (
                          <div className="w-16 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.hotelImage || "/placeholder.svg?height=48&width=64"}
                              alt={item.hotelName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.hotelName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-medium text-emerald-600">${item.price}/night</p>
                            <p className="text-xs text-muted-foreground">
                              Added {item.addedAt?.toDate().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {wishlist.length > 5 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/wishlist">View All Favorites ({wishlist.length})</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorite hotels yet</h3>
                  <p className="text-muted-foreground mb-4">Save hotels you love for easy access later</p>
                  <Button asChild>
                    <Link href="/">Discover Hotels</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card> */}
      </div>
    </div>
  );
};

export default BookingList;
