import { useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImage";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { socketStore } from "../store/socketStore";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const navigate = useNavigate()
  const { connectSocket } = socketStore()
  const [logging, setLogging] = useState(false)

  useEffect(() => {
    const token = Cookies.get("chatApp");
    if (token && token !== "undefined" && token !== "null") {
      navigate("/");
    } else {
      navigate("/login")
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLogging(true)
    const formData = new FormData(e.target);
    const obj = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    axios.post(`${apiUrl}/auth/login`, obj)
      .then((res) => {
        if (res.data.code == 13)  {
          setLogging(false)
          toast.error("Invalid Credentials❌")
        }
        if (res.data.code == 12) {
          setLogging(false) 
          toast.error("User not found❗")
        }
        if (res.status == 200) {
          if (res.data.token) {
            setLogging(false) 
            Cookies.set("chatApp", res.data.token)
            navigate("/")
            connectSocket()
            toast.success("Login Successfull✅")
          } else {
            toast.error("Something went wrong❗");
          }

        }
        
      })
  }
  return (
    <div className="">
      <div className="grid grid-cols-[30%_auto] max-sm:grid-cols-1 gap-[2%] content-start p-5">

        {/* Left side: Login Form */}
        <div className="bg-[#191e24] p-10 rounded-2xl text-white">
          <h1 className="text-2xl py-2 text-center">Log In</h1>

          <form className="space-y-4" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label className="block mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="input w-full"
                required
                placeholder="mail@site.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="input w-full"
                required
                placeholder="Password"
                minLength="8"
                title="Enter your password"
              />
            </div>
            <p className="text-sm mt-4 text-gray-400">Forgot Password? <a className="cursor-pointer hover:underline text-sm mt-4 text-blue-400" onClick={e => navigate("/forgot-password")}>Reset</a></p>
            {/* Submit Button */}
            <button
              className="btn btn-neutral btn-outline bg-white text-[#1d232a] w-full mt-2"
              type="submit"
            >
              {
                logging? <>
                  Logging In <span className="loading loading-spinner"></span>
                </> : "Log In"
              }
              
            </button>

            {/* Don't have an account */}
            <p className="text-center text-sm mt-4 text-gray-400">
              Don't have an account?{" "}
              <a onClick={e => navigate("/signup")} className="text-blue-400 hover:underline cursor-pointer">
                Sign up
              </a>
            </p>
          </form>
        </div>

        {/* Right side image/description */}
        <div className="grow">
          <AuthImagePattern
            title="Welcome Back"
            subtitle="Log in to continue sharing, discovering, and connecting with your community."
          />
        </div>
      </div>
    </div>
  );
}
