import { useEffect, useState } from "react";
import axios from "axios";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        alert("Unauthorized or failed to load inbox.");
      }
    };

    fetchMessages();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-6 text-center">Inbox Messages</h2>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white border p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{msg.name} ({msg.email})</h3>
                <span className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
