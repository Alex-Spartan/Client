import { useContext, useEffect, useState } from "react";
import { loginBg } from "../assets/Index";

import { Form, Link, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import axios from "axios";
import { UserContext } from "../UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext)
  const setValue = (e, setVariable) => {
    setVariable(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const { data } = await axios.post("/auth/login", { email, password });
      setUser(data);
      // const userData = localStorage.setItem('user', JSON.stringify(data));
      navigate("/");
    } 
    catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   const data = localStorage.getItem('user');
  //   const user = JSON.parse(data);
  //   if(user) {
  //     setUser(user)
  //   }
  // }, [user])
  return (
    <LoginForm title="Login" img={loginBg}>
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
