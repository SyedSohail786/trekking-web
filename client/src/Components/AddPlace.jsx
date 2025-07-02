import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

<<<<<<< HEAD
const AddPlace = () => {
  const [treks, setTreks] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'add', 'edit', 'view'
  const [currentTrek, setCurrentTrek] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
=======
// Components
import Navbar from "./Components/Navbar";
import HeroCarousel from "./Components/HeroCarousel";
import TrekSearch from "./Components/TrekSearch";
import Footer from "./Components/Footer";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Availability from "./Pages/Availability";
import Inbox from "./Pages/Inbox";
>>>>>>> 98ade1feba17d594f4fdb71e19874e73306d4f42

// Admin Pages
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import { ToastContainer } from "react-toastify";
import PopularTrek from "./Components/PopularTrek";
import Visitors from "./Components/Visitors";
import ManageBlog from "./Components/ManageBlogs";
import BlogsForUsers from "./Components/BlogsForUsers";
import BlogDetails from "./Components/BlogDetails";
import Auth from "./Components/Auth";
import TrekDetails from "./Components/TrekDetails";
import AddPlace from "./Components/AddPlace";

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
            <Route path="/trek/:slug" element={<TrekDetails />} />
            <Route path="/blogs" element={<BlogsForUsers />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/auth" element={<Auth onLogin={() => setIsUserLoggedIn(true)} />} />

<<<<<<< HEAD
export default AddPlace;
=======
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
>>>>>>> 98ade1feba17d594f4fdb71e19874e73306d4f42
