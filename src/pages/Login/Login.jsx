import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import axios from "axios";
import { auth } from "../../firebase/firebaseConfig";
import { IoLogoGoogle } from "react-icons/io5";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAppStore } from "@/store/useAppStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const { setUser } = useContext(UserContext)
  const setUser = useAppStore((s) => s.setUser);
  const setReady = useAppStore((s) => s.setReady);

  const setValue = (e, setVariable) => {
    setVariable(e.target.value);
  };

  const LoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const data = await signInWithPopup(auth, provider);
      setUser(data._tokenResponse);
      setReady(true);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const { data } = await axios.post("/auth/login", { email, password });
      setUser(data);
      setReady(true);
      navigate("/");
    } 
    catch (error) {
      console.log(error);
    }
  }

  return (
    <LoginForm title="Login">
      <form onSubmit={handleSubmit}>
        <div className="text-lg">
          <div className="mt-6">
            <div className="mb-1">
              <label className="">Email: </label>
            </div>
            <div className="relative">
              <input
                type="email"
                className="w-full border-none rounded-md px-2 py-1 flex-1 text-black"
                value={email}
                required
                onChange={(e) => setValue(e, setEmail)}
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-1">
              <label className="">Password: </label>
            </div>
            <div className="relative">
              <input
                type="password"
                className="w-full border-none rounded-md px-2 py-1 flex-1 text-black"
                value={password}
                required
                onChange={(e) => setValue(e, setPassword)}
              />
            </div>
          </div>
          <div className="mt-6 mb-4">
            <button className="border-none rounded-lg px-8 py-1 w-full bg-[#46494C] ">
              Login
            </button>
            <button 
              onClick={LoginWithGoogle} 
              type="button"
              className="border-none rounded-lg mt-4 px-8 py-1 w-full bg-[#46494C] flex items-center gap-2"
            >
              <IoLogoGoogle />
              Login with Google
            </button>
          </div>
        </div>
      </form>
      
      <div className="flex gap-2">
        <p className="text-black">Don't have an account? </p>
        <Link className="text-blue-700 underline" to="/signup">Signup</Link>
      </div>
    </LoginForm>
  );
};

export default Login;
