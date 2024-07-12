import { useContext } from "react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMenuSharp } from "react-icons/io5";
import { UserContext } from "../UserContext";
const Header = ({ title, checkIn, checkOut, children }) => {
  const checkin = checkIn ? checkIn.split("T")[0] : "";
  const checkout = checkOut ? checkOut.split("T")[0] : "";
  const { user } = useContext(UserContext);

  return (
    <header className="w-full bg-[#23CE6B]">
      <div className="py-4 px-5 p-2 md:py-4 md:px-16">
        <div className="w-full m-auto flex flex-row justify-between">
          <Link to={"/"} className="flex gap-2 justify-center items-center md:m-2">
            <IoHome className="text-3xl md:block md:text-2xl" />
            <div className="hidden md:block">
              GoTrip
            </div>
          </Link>
          {checkin && checkout && title ? (
            <div className="flex gap-3 justify-center items-center md:m-2">
              <input type="text" value={title} className="hidden md:block md:w-1/3 md:bg-[#FBFBFF] md:p-1 md:pl-2  md:rounded-lg" />
              <input type="date" value={checkout} className="hidden md:block md:w-1/3 md:bg-[#FBFBFF] md:p-1 md:pl-2   md:rounded-lg" />
              <input type="date" value={checkin} className="hidden md:block md:w-1/3 md:bg-[#FBFBFF] md:p-1 md:pl-2  md:rounded-lg" />
            </div>
          ) : (
            <div className="hidden md:block"></div>
          )}
          <div
            className={`${
              user === null ? "flex" : "hidden"
            } justify-center items-center gap-1 p-1 md:m-2`}
          >
            <button className=" border-none p-2 rounded-xl bg-[#01BAEF] shadow-md font-medium">
              <Link to="/login">Login/SignUp</Link>
            </button>
          </div>
          <Link
            to={"/account"}
            className={`${
              user === null ? "hidden" : "flex"
            } justify-center items-center gap-1 p-1 md:m-2 bg-slate-300 md:px-2 md:py-1 rounded-3xl`}
          >
            <div className="md:block cursor-pointer">
              <IoMenuSharp className="hidden text-2xl md:block" />
            </div>
            <div>
              <IoPersonCircleSharp className="text-3xl cursor-pointer md:cursor-default" />
            </div>
          </Link>
        </div>
        <div>
          {children ? children : '' }
        </div>
      </div>
    </header>
  );
};

export default Header;
