import axios from 'axios';
import io from 'socket.io-client';
import { create } from 'zustand';
const apiurl = import.meta.env.VITE_BACKEND_URL;
import Cookies from "js-cookie";

export const socketStore = create((set, get) => ({
     socket: null,
     onlineUsers: [],
     profile: null,
     setProfile: (res) => {
          set({ profile: res })
     },
     connectSocket: async () => {
          const token = Cookies.get('chatApp');
          const res = await axios.get(`${apiurl}/auth/getProfile`, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          })

          const socket = io(apiurl, {
               query: {
                    userId: res.data._id
               }
          })
          if (get().socket?.connected) return;
          socket.connect()
          set({ socket })
          socket.on("getOnlineUsers", (userIds) => {
               set({ onlineUsers: userIds })
          })
     },
     disconnectSocket: () => {
          if (get().socket?.connected) {
               get().socket.disconnect()
               get().setProfile(null)
          }
     }
}))