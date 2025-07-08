import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    setDeletingId(id);
    try {
      await axios.delete(`${backendURL}/api/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(prev => prev.filter(msg => msg._id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Inbox Messages</h1>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No messages yet</h3>
              <p className="mt-1 text-gray-500">Your inbox is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {message.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{message.name}</h3>
                        <p className="text-xs text-gray-500">{message.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDelete(message._id)}
                        disabled={deletingId === message._id}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        {deletingId === message._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 whitespace-pre-line">{message.message}</p>
                    {message.phone && (
                      <div className="mt-3">
                        <a
                          href={`tel:${message.phone}`}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {message.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
