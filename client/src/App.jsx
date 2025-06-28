import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Components
import Navbar from "./Components/Navbar";
import HeroCarousel from "./Components/HeroCarousel";
import TrekSearch from "./Components/TrekSearch";
import Footer from "./Components/Footer";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Availability from "./Pages/Availability";
import Inbox from "./Pages/Inbox";

// Admin Pages
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import PopularTrek from "./Components/PopularTrek";
import TrekDetail from "./Components/TrekDetails";
import Visitors from "./Components/Visitors";
import AddPlace from "./Components/addPlace";
import ManageBlog from "./Components/ManageBlogs";
import BlogsForUsers from "./Components/BlogsForUsers";
import BlogDetails from "./Components/BlogDetails";
import Auth from "./Components/Auth";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = Cookies.get("token");
    setIsAdminLoggedIn(!!adminToken);
    setIsUserLoggedIn(!!userToken);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
  };

  const handleUserLogout = () => {
    Cookies.remove("token");
    setIsUserLoggedIn(false);
  };

  return (
    <Router>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />


        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <HeroCarousel />
                  <TrekSearch />
                  <PopularTrek />
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/trek/:slug" element={<TrekDetail />} />
            <Route path="/blogs" element={<BlogsForUsers />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Auth onLogin={() => setIsUserLoggedIn(true)} />} />

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
                isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin" />
              }
            />
            <Route
              path="/admin/inbox"
              element={isAdminLoggedIn ? <Inbox /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin/visitors"
              element={isAdminLoggedIn ? <Visitors /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin/addPlace"
              element={isAdminLoggedIn ? <AddPlace /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin/manageBlog"
              element={isAdminLoggedIn ? <ManageBlog /> : <Navigate to="/admin" />}
            />
          </Routes>
        </main>

        {!isAdminLoggedIn && <Footer />}
      </div>
    </Router>
  );
}

export default App;
