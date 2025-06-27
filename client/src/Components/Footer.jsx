import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">Aranya Vihaara</h2>
          <p className="text-sm text-gray-300">© {new Date().getFullYear()} Digisnare. All rights reserved.</p>
        </div>

        <div className="flex space-x-4">
          <Link to="/" className="text-sm hover:text-yellow-300 transition">Home</Link>
          <Link to="/about" className="text-sm hover:text-yellow-300 transition">About</Link>
          <Link to="/contact" className="text-sm hover:text-yellow-300 transition">Contact</Link>
          <Link to="/admin" className="text-sm hover:text-yellow-300 transition">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
