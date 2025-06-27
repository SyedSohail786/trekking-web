import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquareDashed, Menu, X } from "lucide-react";
import { FaUser } from "react-icons/fa6";
import { FaRegSun } from "react-icons/fa6";
import { FaRightToBracket } from "react-icons/fa6";
import { FaCommentDots } from "react-icons/fa6";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { socketStore } from "../store/socketStore";
import { allMsgWork } from "../store/messageStore";

export default function Navbar() {
  const navigate = useNavigate();
  const urlPath = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const {disconnectSocket, connectSocket} = socketStore();
  const {setSelectedChat} = allMsgWork()
  const isAuthPage =
    urlPath.pathname === "/login" ||
    urlPath.pathname === "/signup" ||
    urlPath.pathname === "/forgot-password";
  
    useEffect(() => {
      const token = Cookies.get("chatApp");
      if (token && token !== "undefined" && token !== "null") {
         connectSocket()
      }else{
        navigate("/login")
      }
    }, []);

    const logout=()=>{
      Cookies.remove("chatApp");
      setSelectedChat(null)
      toast.success("You have been logged out")
      disconnectSocket()
      navigate("/login")
    }
  const navLinks = (
    <>
      {!isAuthPage && (
        <>
          <button onClick={() =>{setMenuOpen(!menuOpen)
             navigate("/")}} className="btn btn-ghost btn-sm">
            <FaCommentDots />Chat
          </button>
          <button onClick={() => {setMenuOpen(!menuOpen)
            navigate("/profile")}} className="btn btn-ghost btn-sm">
            <FaUser /> Profile
          </button>
        </>
      )}
      <button onClick={() => {setMenuOpen(!menuOpen)
        navigate("/settings")}} className="btn btn-ghost btn-sm">
        <FaRegSun />Setting
      </button>
      {isAuthPage ? (
        <button onClick={() => navigate("/login")} className="btn btn-ghost btn-sm">
          Login
        </button>
      ) : (
        <button className="btn btn-ghost btn-sm" onClick={logout}> <FaRightToBracket /> Logout</button>
      )}
    </>
  );

  return (
    <div className="w-full bg-base-100 shadow-sm px-5 py-3 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-50">
      
      {/* Logo Section */}

      
      <>
      <div
        className="text-2xl font-semibold cursor-pointer flex items-center gap-1"
        onClick={() => navigate("/")}
      >
        <p>Hey</p>
        <span className="text-primary">Chat</span>
        <MessageSquareDashed size={24} />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-3 items-center">{navLinks}</div>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-5 bg-base-100 border rounded-xl shadow-md p-4 flex flex-col gap-2 z-50 md:hidden">
          {navLinks}
        </div>
      )}

      </>
    </div>

    
  );
}
