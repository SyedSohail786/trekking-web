import { useNavigate } from "react-router-dom"
import { Camera, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { socketStore } from "../store/socketStore";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = socketStore()
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [image, setImage] = useState(null);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  };

  useEffect(() => {
    const token = Cookies.get("chatApp");
    if (token && token !== "undefined" && token !== "null") {
      setLoadingProfile(true)
      const token = Cookies.get("chatApp")
      axios.get(`${apiUrl}/auth/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setProfile(res.data)
          setImage(res.data.profilePic)
          setLoadingProfile(false)
        })

    } else {
      navigate("/login")
    }
  }, []);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const token = Cookies.get("chatApp");

    if (file && token) {
      const formData = new FormData();
      formData.append("profilePic", file);
      axios.put(`${apiUrl}/profile-update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        const url = res.data.profilePic
        setImage(url);
        toast.success("Profile Pic Updated");
      })


    }
  };

  return (
    <div className="h-screen">
      {
        profile ?
          <div className="max-w-2xl mx-auto p-4 py-2">
            <div className="bg-base-300 rounded-xl p-6 space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="mt-2">Your profile information</p>
              </div>

              {/* avatar upload section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      image ||
                      "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                    }
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                  >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-zinc-400">Click the camera icon to update your photo</p>
              </div>

              {/* other info */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{profile.userName}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{profile.email}</p>
                </div>
              </div>

              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                    <span>Member Since</span>
                    <span>{new Intl.DateTimeFormat("en-IN", options).format(new Date(profile.createdAt))}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="flex flex-col gap-6 max-w-2xl w-full mx-auto p-4 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="skeleton size-32 rounded-full mx-auto sm:mx-0" />
              <div className="flex flex-col gap-3 w-full">
                <div className="skeleton h-4 w-1/8 sm:w-1/2" />
                <div className="skeleton h-4 w-5/8" />
                <div className="skeleton h-4 w-6/8" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
            <div className="skeleton h-72 w-full rounded-xl" />
          </div>

      }

    </div>
  );
};

export default ProfilePage;
