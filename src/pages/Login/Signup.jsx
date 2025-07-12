import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ArrowLeft, Home } from "lucide-react";
import { useState } from "react";
import { IoLogoGoogle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  const SignupWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const data = await signInWithPopup(auth, provider);
      const response = await axios.post("/api/auth/google-login", {
        email: data.user.email,
      });
      const { user, message, error } = response.data;
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(message);
      setUser({
        fullName: user.fullName,
        email: user.email,
        method: user.method,
        _id: user._id,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signup", { fullName, email, password });
      const { user, message, error } = response.data;
      if (error) {
        toast.error(message);
        return;
      }
      toast.success(message);
      setUser({
        fullName: user.fullName,
        email: user.email,
        method: user.method,
        _id: user._id,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-xl text-emerald-600">GoTrip</span>
          </Link>
          <div className="ml-auto">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <Link to="/" className="flex items-center">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit">
                Sign Up
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600">or</div>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={SignupWithGoogle}
            >
              <IoLogoGoogle className="mr-2" /> Sign up with Google
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:underline ml-1">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Signup;
