import React from "react";
import {
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoInstagram,
} from "react-icons/io5";

const Footer = () => {
  return (
    <div className="mt-24 px-16 py-8 text-lg text-white bg-[#12130F]">
      <div className=" grid grid-cols-12">
        <div className="col-span-3">
          <div className="flex flex-col font-bold">
            <h1>GoTrip</h1>
          </div>
          <div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus reprehenderit nesciunt mollitia.
            </p>
          </div>
        </div>
        <div className="col-span-2"></div>
        <div className="flex gap-12 col-span-4">
          <div>
            <div>Company</div>
            <div>Name</div>
            <div>Address</div>
          </div>
          <div>
            <div>Contact</div>
            <div>DontContact@gmail.com</div>
            <div>Partners</div>
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-2">
          <div className="mb-3">Follow us:</div>
          <div className="flex gap-4 text-3xl">
            <div>
              <IoLogoFacebook />
            </div>
            <div>
              <IoLogoYoutube />
            </div>
            <div>
              <IoLogoInstagram />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-2">
        Tradmark copyright &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Footer;
