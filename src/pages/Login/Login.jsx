import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/firebaseConfig";
import { useAppStore } from "@/store/useAppStore";

import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { IoLogoGoogle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

import FormHeader from "@/components/Form-Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  const LoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const data = await signInWithPopup(auth, provider);
      const res = await axios.post("/api/auth/google-login", { email: data.user.email, fullName: data.user.displayName, uid: data.user.uid });
      const { message, error, user } = res.data;
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(message);
      setUser({ fullName: user.fullName, email: user.email, method: "google", _id: user._id });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { user, message, error } = response.data;
      if (error) {
        toast.error(message);
        return;
      }
      toast.success(message);
      setUser(user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <FormHeader />

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                Login
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600">or</div>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={LoginWithGoogle}
            >
              <IoLogoGoogle className="mr-2" /> Login with Google
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Don&apos;t have an account?
              <Link to="/signup" className="text-blue-500 hover:underline ml-1">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Login;
