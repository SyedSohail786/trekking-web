import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react"; // ⬅️ Add this
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import ForgotPassword from "./components/ForgotPassword";
import { ThemeSet } from "./store/ThemeStore";

function App() {
  const location = useLocation();
  const { theme } = ThemeSet();
  const [navbarHidden, setNavbarHidden] = useState(false);

  const hideNavbarRoutes = ["/login", "/signup", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || navbarHidden;

  return (
    <div className="min-h-screen flex flex-col bg-base-100" data-theme={theme}>
      {!shouldHideNavbar && <Navbar />}

      <main className={`flex-1 ${!shouldHideNavbar ? "pt-16" : ""} overflow-hidden`}>
        <Routes>
          <Route path="/" element={<HomePage hideNavbarSetter={setNavbarHidden} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
