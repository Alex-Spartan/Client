import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const FormHeader = () => {
  return (
    <header className="border-b bg-emerald-500 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-white/80" />
          <span className="font-bold text-xl text-white/80">GoTrip</span>
        </Link>
        <div className="ml-auto">
          <Link href="/">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default FormHeader;
