import { useContext } from "react";
import { Link } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { IoBusiness } from "react-icons/io5";
import { IoList } from "react-icons/io5";
import { UserContext } from "../UserContext";

const AccountNav = ({ subpage }) => {
  const { user } = useContext(UserContext);

  function activeLink(type = null) {
    let classes = "flex justify-center items-center gap-2";
    if (type === subpage || (subpage === undefined && type === "profile")) {
      classes += " text-white bg-[#272D2D] px-3 py-1 rounded-2xl";
    }
    return classes;
  }

  return (
    <nav className="flex justify-center font-semibold m-4">
      <div className="w-full mx-auto flex justify-center items-center gap-4 p-2 bg-[#23CE6B] rounded-xl md:p-4 lg:gap-8 lg:w-[25rem]">
        <Link to={"/account"} className={activeLink("profile")}>
          <IoPerson />
          Profile
        </Link>
        {user?.status === "owner" && (
          <Link
            to={"/account/accomodation"}
            className={activeLink("accomodation")}
          >
            <IoBusiness />
            Accomodation
          </Link>
        )}
        <Link to={"/account/bookings"} className={activeLink("bookings")}>
          <IoList />
          Bookings
        </Link>
      </div>
    </nav>
  );
};

export default AccountNav;
