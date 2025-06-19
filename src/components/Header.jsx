/* eslint-disable react/prop-types */
import MainNav from "@/pages/Home/components/MainNav";
import UserNav from "@/pages/Home/components/UserNav";


const Header = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-emerald-500 shadow-sm">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
  );
};

export default Header;
