import { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin(true);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={login} className="max-w-sm mx-auto mt-10 space-y-4 p-6 border rounded">
      <h2 className="text-xl font-bold text-center">Admin Login</h2>
      <input type="email" placeholder="Email" className="w-full border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full border p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-green-700 text-white py-2 rounded">Login</button>
    </form>
  );
};

export default AdminLogin;
