import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/messages", form);
      alert(res.data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
