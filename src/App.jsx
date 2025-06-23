import axios from "axios";

import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import Home from "./pages/Home/Home";
import { UserContextProvider } from "./UserContext";
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Account from "./pages/Account";
import AccomodationForm from "./pages/AccomodationForm";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import { Toaster } from "react-hot-toast";
import HotelDetailsPage from "./pages/Listing/Hotel-Details";


axios.defaults.baseURL = "https://gotripapi.onrender.com";
// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true; 

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Home />} />,
      <Route path="/hotel/:id" element={<HotelDetailsPage />} />,
      <Route path="/hotel/:id/booking" element={<Booking />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/signup" element={<Signup />} />,
      <Route path="/account/:subpage?" element={<Account />} />,
      <Route path="/account/accomodation/new" element={<AccomodationForm />} />,
      <Route path="/account/accomodation/:id" element={<AccomodationForm />} />,
      <Route path="/booking/:bookingStatus" element={<Payment />} />,
    ])
  );
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </UserContextProvider>
  );
}

export default App;
