import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FiUser, FiMail, FiLock, FiLogIn, FiUserPlus } from "react-icons/fi";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUserLoggedIn } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const res = await axios.post(`${backendURL}+${url}`, form);
      toast.success(isLogin ? "Login successful" : "Registration successful");
      setUserLoggedIn(true, res.data.token);
      if (onLogin) onLogin();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Sign in to your account" : "Get started with your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLogin ? (
                  <FiLogIn className={`h-5 w-5 text-green-300 ${isSubmitting ? "animate-pulse" : ""}`} />
                ) : (
                  <FiUserPlus className={`h-5 w-5 text-green-300 ${isSubmitting ? "animate-pulse" : ""}`} />
                )}
              </span>
              {isSubmitting ? (
                "Processing..."
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-green-600 hover:text-green-500 text-sm"
          >
            {isLogin ? (
              <>
                Don't have an account? <span className="font-bold">Sign up</span>
              </>
            ) : (
              <>
                Already have an account? <span className="font-bold">Sign in</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;