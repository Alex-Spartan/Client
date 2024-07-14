import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { UserContext } from "../UserContext";
import axios from "axios";
import AccountNav from "../components/AccountNav";
import Accomodation from "../components/Accomodation";
import BookingList from "../components/BookingList";
import Header from "../components/Header";


const Account = () => {
  const { user, ready, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };


  useEffect(() => {
    if (ready && !user) {
      navigate("/login");
    }
  }, [user, ready, navigate]);


  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }
  
  return (
    <>
    <Header />
    <AccountNav subpage={subpage} />
      {subpage === "profile" && (
        <div className="flex flex-col justify-center items-center w-1/2 mx-auto mt-[5rem]">
          logged in as {user.name} ({user.email})<br />
          <button
            onClick={logout}
            className="bg-[#23CE6B] w-full mt-2 p-1 rounded-full md:w-[35%]"
          >
            log out
          </button>
        </div>
      )}

      {subpage === "accomodation" && (
        <Accomodation />
      )}

      {subpage === "bookings" && (<BookingList />)}
    </>
  );
};

export default Account;
