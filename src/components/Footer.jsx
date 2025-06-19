import {
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoInstagram,
} from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-white text-sm">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">GoTrip</h4>
          <p>
            Explore the best hotel deals across India with seamless booking and trusted reviews.
          </p>
        </div>

        <div className="md:flex flex-col items-center">
          <h4 className="text-md font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>

        <div className="">
          <h4 className="text-md font-semibold mb-2">Contact</h4>
          <ul className="space-y-1">
            <li>Email: contact@gotrip.com</li>
            <li>Phone: +91 9876543210</li>
            <li>Partners</li>
          </ul>
        </div>

        <div className="md:flex flex-col items-center">
          <h4 className="text-md font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4 mt-2">
            <a href="#" aria-label="Facebook">
              <IoLogoFacebook className="text-xl" />
            </a>
            <a href="#" aria-label="YouTube">
              <IoLogoYoutube className="text-xl" />
            </a>
            <a href="#" aria-label="Instagram">
              <IoLogoInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-200">
        © 2025 GoTrip. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
