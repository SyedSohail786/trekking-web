import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { setUserLoggedIn } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const res = await axios.post(`http://localhost:8000${url}`, form);
      toast.success(isLogin ? "Login successful" : "Registration successful");

      // ✅ Zustand + Cookie Sync
      setUserLoggedIn(true, res.data.token); // store real token

      // (Optional: Also update App state if you're using `onLogin`)
      if (onLogin) onLogin();

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-green-600 ml-2 hover:underline"
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
