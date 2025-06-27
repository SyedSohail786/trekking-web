import axios from "axios"
import { create } from "zustand"
const apribaseurl = import.meta.env.VITE_BACKEND_URL;
import Cookies from 'js-cookie';
import { socketStore } from "./socketStore";


export const allMsgWork = create((set, get) => ({
     selectedChat: null,
     setSelectedChat: (user) => {
          set({ selectedChat: user });
          get().subscribeMessages(); // 🧠 add this to ensure socket is always listening
     },
     loadingChat: false,
     messages: [],
     fetchSelectedChats: (id) => {
          set({ loadingChat: true })
          const token = Cookies.get("chatApp");
          axios.get(`${apribaseurl}/chat-with/${id}`, {
               headers: {
                    Authorization: `Bearer ${token}`
               }
          })
               .then((res) => {
                    get().subscribeMessages()
                    set({ messages: res.data })
                    set({ loadingChat: false })
               })
     },
     subscribeMessages: () => {
          const { selectedChat } = get();
          const socket = socketStore.getState().socket;
          if (!socket || !selectedChat) return;

          socket.off("newMessage"); // Remove old listener
          socket.on("newMessage", (newMessage) => {
               const currentMessages = get().messages;
               const existingMessages = Array.isArray(currentMessages) ? currentMessages : [];
               set({ messages: [...existingMessages, newMessage] });
          });
     }



}))