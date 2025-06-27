import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ isAdmin, onLogout }) => {
  const [adminStatus, setAdminStatus] = useState(isAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAdminStatus(isAdmin);
  }, [isAdmin, location]);

  const handleLogoutClick = () => {
     navigate("/");
    onLogout();
   
  };

  return (
    <nav className="bg-gradient-to-r from-green-900 to-green-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
            Aranya Vihaara
          </span>
        </Link>
        
        <ul className="flex space-x-6 items-center">
          {!adminStatus && (
            <>
              <li>
                <Link to="/" className="hover:text-yellow-200 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-200 transition-colors font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-200 transition-colors font-medium">
                  Contact
                </Link>
              </li>
            </>
          )}
          
          {adminStatus ? (
            <>
              <li>
                <Link to="/admin/dashboard" className="bg-white text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/inbox" className="hover:text-yellow-200 transition-colors font-medium">
                  Inbox
                </Link>
              </li>
              <button
                onClick={handleLogoutClick}
                className="text-red-300 hover:text-red-200 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/admin" 
              className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Admin
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;