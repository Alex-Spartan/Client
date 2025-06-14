import { Heart, HelpCircle, LogOut, User } from "lucide-react";
import { useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const UserNav = () => {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser === null) {
        setUser(null);
      }
    });
    return () => unsubscribe();
  })

  const handleLogout = () => {
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


  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="text-white">
        <Heart className="h-5 w-5" />
        <span className="sr-only">Wishlist</span>
      </Button>

      {user !== null ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-emerald-700 text-white">
                  {/* Replace with user */}
                  GT
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <Link to="/account">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <button onClick={handleLogout}>Log out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="hidden md:flex bg-white text-emerald-600 hover:bg-gray-100">
          <Link to="/login">Login / Sign Up</Link>
        </Button>
      )}
    </div>
  );
};

export default UserNav;
