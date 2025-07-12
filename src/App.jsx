import axios from "axios";

import { Toaster } from "react-hot-toast";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AccomodationForm from "./pages/AccomodationForm";
import Account from "./pages/Account";
import Booking from "./pages/Booking/Booking";
import Home from "./pages/Home/Home";
import HotelDetailsPage from "./pages/Listing/Hotel-Details";
import HotelsPage from "./pages/Listings/Hotels-Page";
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Home />} />,
      <Route path="/hotel" element={<HotelsPage />} />,
      <Route path="/hotel/:id" element={<HotelDetailsPage />} />,
      <Route path="/hotel/booking" element={<Booking />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/signup" element={<Signup />} />,
      <Route path="/account/:subpage?" element={<Account />} />,
      <Route path="/account/accomodation/new" element={<AccomodationForm />} />,
      <Route path="/account/accomodation/:id" element={<AccomodationForm />} />,
    ])
  );
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
