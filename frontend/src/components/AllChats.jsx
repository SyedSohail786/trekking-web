import axios from 'axios';
import React, { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import Cookies from 'js-cookie';
import { allMsgWork } from '../store/messageStore';
import { socketStore } from '../store/socketStore';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function AllChats({ onSelectChat }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { setSelectedChat, fetchSelectedChats } = allMsgWork();
  const {onlineUsers} = socketStore()
  
  useEffect(() => {
    setLoadingUsers(true);
    const token = Cookies.get("chatApp");
    axios.get(apiUrl + "/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUsers(res.data.users);
        setLoadingUsers(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      });
  }, []);
  
  const handleUserClick = (user) => {
    
    setSelectedChat(user)
    fetchSelectedChats(user._id)
    if (onSelectChat) {
      onSelectChat();
    }
  };


  return (
    <div className="border p-2 rounded-[0px_15px_15px_0px] overflow-hidden h-full bg-base-100">
      {/* Mobile header - only visible on small screens */}
      <div className="md:hidden p-3 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chats</h1>
        <button
          onClick={() => onSelectChat && onSelectChat()}
          className="btn btn-sm btn-ghost"
        >
          ✕
        </button>
      </div>
      <div className=' flex items-center justify-center'>
          
          <h1 className="text-xl text-center py-3 hidden md:block mr-2"> All Chats </h1>
          <MessageCircle className='hidden md:block' />
      </div>
      

      {/* SCROLLABLE CHAT LIST */}
      <div className="overflow-y-auto h-[calc(100vh-8rem)] md:h-[80vh] pr-2 hide-scrollbar">

        {
          users.length ==0 ?<div className=' h-full flex items-center justify-center '> 
            <span className="loading loading-infinity loading-xl"></span>
          </div> :
        <ul className="list-none">
          {loadingUsers ? (
            <div >
              {[...Array(5)].map((_, i) => (
                <div key={`skeleton-${i}`} className="...">
                  <div className="flex w-45 flex-col gap-4 items-center mb-4" key={i}>
                    <div className="flex items-center gap-4 w-full p-2">
                      <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
                      <div className="flex flex-col gap-4 flex-1">
                        <div className="skeleton h-2 w-20"></div>
                        <div className="skeleton h-2 w-28"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {users.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center py-2 hover:bg-error hover:text-neutral rounded transition-colors"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={user.profilePic || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"}
                    className="w-10 h-10 rounded-full mx-3 border-2"
                    alt="profile"
                  />
                  <div className="w-full flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <h1 className="font-medium">{user.userName}</h1>
                      <h6 className="text-[10px] text-green-500">{onlineUsers.includes(user._id)? "online": "Offline"}</h6>
                    </div>
                    <h1 className="text-[10px] text-gray-500">10:11pm</h1>
                  </div>
                </li>
              ))}

            </>
          )}
        </ul>
        
        }
      </div>
    </div>
  );
}