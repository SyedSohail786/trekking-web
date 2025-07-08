import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  isAdmin: false,
  isUserLoggedIn: !!Cookies.get("token"),
  setIsAdmin:()=>{
     set({isAdmin:true})
  },
  setUserLoggedIn: (status, token = "") => {
  set({ isUserLoggedIn: status });
  if (status && token) {
    Cookies.set("token", token, { expires: 7 });
  } else {
    Cookies.remove("token");
  }
},

  logoutAdmin: () => {
    set({ isAdmin: false });
    localStorage.removeItem("adminToken")
  },

  logoutUser: () => {
    set({ isUserLoggedIn: false });
    Cookies.remove("token");
  },
  checkAuthStatus: () => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = Cookies.get("token");
    
    set({ 
      isAdmin: !!adminToken,
      isUserLoggedIn: !!userToken
    });
  },
}));
