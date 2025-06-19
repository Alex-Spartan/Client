import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import axios from "axios";
import Accomodation from "../components/Accomodation";
import BookingList from "../components/BookingList";
import { useAppStore } from "@/store/useAppStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FormHeader from "@/components/Form-Header";
import { Calendar, CreditCard } from "lucide-react";

const Account = () => {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const navigate = useNavigate();

  // const { bookings, loading: bookingsLoading } = useBookings()

  const logout = async () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        toast.success("User signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
        toast.error("Failed to sign out");
      });
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  return (
    <>
      <FormHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="flex gap-4 mb-8 justify-center">
          <Link
            to="/account/profile"
            className={`px-4 py-2 rounded ${
              subpage === "profile"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Profile
          </Link>
          <Link
            to="/account/bookings"
            className={`px-4 py-2 rounded ${
              subpage === "bookings"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Bookings
          </Link>
          {user.status === 1 && (
            <Link
              to="/account/accomodation"
              className={`px-4 py-2 rounded ${
                subpage === "accomodation"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              My Hotels
            </Link>
          )}
        </nav>
        {subpage === "profile" && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.photoURL || "/placeholder.svg"}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback className="text-xl">
                    {user?.fullName?.charAt(0) ||
                      user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">
                    {user?.fullName || "User"}
                  </h1>
                  <p className="text-muted-foreground mb-3">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {subpage === "accomodation" && <Accomodation />}

      {subpage === "bookings" && <BookingList />}
    </>
  );
};

export default Account;
