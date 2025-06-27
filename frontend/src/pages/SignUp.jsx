import { useNavigate } from "react-router-dom"
import AuthImagePattern from "../components/AuthImage"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { socketStore } from "../store/socketStore"
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [loadingOtpSend, setLoadingOtpSend] = useState(false);
  const [loadingOtpVerify, setLoadingOtpVerify] = useState(false);
  const { connectSocket } = socketStore();

  useEffect(() => {
    const token = Cookies.get("chatApp");
    if (token && token !== "undefined" && token !== "null") {
      navigate("/");
    }
  }, []);


  const handleSignup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
      otp: formData.get("otp") || "",
      lastSeen:new Date()
    };

    if (step === 0) {
      setLoadingOtpSend(true);

      axios.post(`${apiUrl}/auth/signup-otp`, obj)
        .then((res) => {
          setLoadingOtpSend(false);
          if (res.data.code === 12) return toast.error("User Already Exist❗❗");
          if (res.data.code === 200) {
            setStep(1);
            toast.success("OTP Sent Successfully✅");
          }
        }).catch(() => setLoadingOtpSend(false));
    } else {
      setLoadingOtpVerify(true);

      axios.post(`${apiUrl}/auth/signup`, obj)
        .then((res) => {
          if (res.data.code === 76) {
            toast.error("No OTP Found");
            return setLoadingOtpVerify(false);
          }
          if (res.data.code === 77) {
            toast.error("Invalid OTP");
            return setLoadingOtpVerify(false);
          }

          if (res.status === 200) {
            toast.success("Enjoy Chatting✨");
            connectSocket()
            if (res.data.token) {
              Cookies.set("chatApp", res.data.token);
              navigate("/");
            }
          } else {
            toast.error("Something went wrong❌");
          }
        }).catch(() => {
          setLoadingOtpVerify(false);
          toast.error("Signup failed❌");
        });
    }
  }

  return (
    <div className=''>
      <div className="grid grid-cols-[30%_auto] max-sm:grid-cols-1 gap-[2%] content-start p-5">
        <div className="bg-[#191e24] p-10 rounded-2xl text-white">
          <h1 className="text-2xl py-2 text-center">Sign Up</h1>

          <form className="space-y-4" onSubmit={handleSignup}>

            {/* Username */}
            <div>
              <label className="block mb-1">Username</label>
              <input
                name="userName"
                type="text"
                className="input w-full"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1">Your Email</label>
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
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must include number, lowercase and uppercase letter"
              />
            </div>
            {step >= 1 && (
              <div>
                <label className="block mb-1">Enter OTP</label>
                <input
                  name="otp"
                  type="text"
                  className="input w-full"
                  required
                  placeholder="6-digit OTP"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {/* Submit */}
            <button
              className="btn btn-neutral btn-outline bg-white text-[#1d232a] w-full mt-2"
              type="submit"
              disabled={loadingOtpSend || loadingOtpVerify}
            >
              {step === 0 && !loadingOtpSend && "Create Account"}
              {step === 0 && loadingOtpSend && (
                <>
                  Sending OTP <span className="loading loading-spinner"></span>
                </>
              )}
              {step === 1 && !loadingOtpVerify && "Verify"}
              {step === 1 && loadingOtpVerify && (
                <>
                  Verifying <span className="loading loading-spinner"></span>
                </>
              )}
            </button>



            {/* Already have an account */}
            <p className="text-center text-sm mt-4 text-gray-400">
              Already have an account? <a onClick={e => navigate("/login")} className="text-blue-400 hover:underline cursor-pointer">Log in</a>
            </p>

          </form>
        </div>

        {/* Right side visual */}
        <div className="grow">
          <AuthImagePattern
            title="Join our community"
            subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
          />
        </div>
      </div>
    </div>
  )
}
