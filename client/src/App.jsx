import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Navbar from "./Components/Navbar";
import HeroCarousel from "./Components/HeroCarousel";
import TrekSearch from "./Components/TrekSearch";
import Footer from "./Components/Footer";
// Pages
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Availability from "./Pages/Availability";
import Inbox from "./Pages/Inbox";

// Admin Pages
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import { ToastContainer } from "react-toastify";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
   
  };

  return (
    <Router>
      <ToastContainer/>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar isAdmin={isAdminLoggedIn} onLogout={handleLogout} />
    <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <HeroCarousel />
                <TrekSearch />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/availability" element={<Availability />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              isAdminLoggedIn ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
          <Route
            path="/admin/inbox"
            element={
              isAdminLoggedIn ? <Inbox /> : <Navigate to="/admin" />
            }
          />
        </Routes>
        </main>
        {
          !isAdminLoggedIn && (
            <Footer />
          )
        }
        
      </div>
    </Router>
  );
}

export default App;
