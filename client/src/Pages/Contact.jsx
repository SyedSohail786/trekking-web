import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.name || !form.email || !form.message) {
      toast.warning("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/messages", form);
      toast.success(res.data.message);
      setForm({ name: "", email: "", message: "", phone: "" });
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Contact Us</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Your phone number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message here..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg shadow-md transition-all ${
                isSubmitting
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-medium flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;