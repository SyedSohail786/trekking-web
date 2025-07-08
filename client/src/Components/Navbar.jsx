import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome, FaInfoCircle, FaEnvelope, FaSignOutAlt, FaUserCog,
  FaUsers, FaInbox, FaHiking, FaBars, FaTimes
} from "react-icons/fa";
import { FaBookOpen, FaUser } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAdmin,
    isUserLoggedIn,
    logoutAdmin,
    logoutUser
  } = useAuthStore();
  
  const [adminStatus, setAdminStatus] = useState(isAdmin);
  useEffect(() => {
    setAdminStatus(isAdmin);
    setMobileMenuOpen(false); // Close menu on route change
  }, [isAdmin, location]);

  const handleLogoutClick = () => {
    navigate("/");
    logoutAdmin();
  };

  const handleUserLogoutClick = () => {
    logoutUser();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const token = localStorage.getItem("adminToken");
  useEffect(()=>{
    if(token) setAdminStatus(true);
  },[])

  return (
    <nav className="bg-gradient-to-r from-green-900 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200 hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300">
              Aranya Vihaara
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!adminStatus ? (
              <>
                <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaHome className="mr-2" />
                  Home
                </Link>
                <Link to="/about" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaInfoCircle className="mr-2" />
                  About
                </Link>
                <Link to="/blogs" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaBookOpen className="mr-2" />
                  Blogs
                </Link>
                <Link to="/contact" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaEnvelope className="mr-2" />
                  Contact
                </Link>

                {isUserLoggedIn ? (
                  <button onClick={handleUserLogoutClick} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-300 hover:text-red-200 transition-colors">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                ) : (
                  <Link to="/auth" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                    <FaUser className="mr-2" />
                    User Login
                  </Link>
                )}

                <Link to="/admin" className="flex items-center bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <FaUserCog className="mr-2" />
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className="flex items-center bg-white text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/visitors" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaUsers className="mr-2" />
                  Visitors
                </Link>
                <Link to="/admin/inbox" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaInbox className="mr-2" />
                  Inbox
                </Link>
                <Link to="/admin/addPlace" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaHiking className="mr-2" />
                  Treks
                </Link>
                <Link to="/admin/manageBlog" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 hover:bg-green-700 transition-all duration-200">
                  <FaBookOpen className="mr-2" />
                  Manage Blogs
                </Link>
                <button onClick={handleLogoutClick} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-300 hover:text-red-200 transition-colors">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-yellow-200 hover:text-white hover:bg-green-700 focus:outline-none transition duration-150 ease-in-out">
              {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!adminStatus ? (
              <>
                <Link to="/" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaHome className="mr-2" />
                  Home
                </Link>
                <Link to="/about" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaInfoCircle className="mr-2" />
                  About
                </Link>
                <Link to="/blogs" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaBookOpen className="mr-2" />
                  Blogs
                </Link>
                <Link to="/contact" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaEnvelope className="mr-2" />
                  Contact
                </Link>

                {isUserLoggedIn ? (
                  <button onClick={() => { handleUserLogoutClick(); toggleMobileMenu(); }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-red-200 transition-colors">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                ) : (
                  <Link to="/auth" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                    <FaUser className="mr-2" />
                    User Login
                  </Link>
                )}

                <Link to="/admin" onClick={toggleMobileMenu} className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-2 w-full">
                  <FaUserCog className="mr-2" />
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" onClick={toggleMobileMenu} className="flex items-center justify-center bg-white text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors mb-2 w-full">
                  Dashboard
                </Link>
                <Link to="/admin/visitors" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaUsers className="mr-2" />
                  Visitors
                </Link>
                <Link to="/admin/inbox" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaInbox className="mr-2" />
                  Inbox
                </Link>
                <Link to="/admin/addPlace" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaHiking className="mr-2" />
                  Treks
                </Link>
                <Link to="/admin/manageBlog" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:text-yellow-200 hover:bg-green-700 block transition-all duration-200">
                  <FaBookOpen className="mr-2" />
                  Manage Blogs
                </Link>
                <button onClick={() => { handleLogoutClick(); toggleMobileMenu(); }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-red-200 transition-colors">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
