import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link to="/">
        <div className="text-3xl font-bold text-black">
          Cervi<span className="text-teal-400">Scan</span>
        </div>
      </Link>

      <nav className="space-x-9">
        <Link to="/" className="text-gray-600 font-bold text-xl hover:text-teal-400">Home</Link>
        <Link to="/about" className="text-gray-600 font-bold text-xl hover:text-teal-400">About</Link>
        <Link to="/services" className="text-gray-600 font-bold text-xl hover:text-teal-400">Services</Link>
        <Link to="/blogs" className="text-gray-600 font-bold text-xl hover:text-teal-400">Blogs</Link>
        <Link to="/contact" className="text-gray-600 font-bold text-xl hover:text-teal-400">Contact</Link>
      </nav>

      <Link to="/login">
        <button className="px-6 py-2 mr-2 text-white font-semibold bg-teal-500 hover:bg-teal-300 rounded-xl transition">
          Login / SignUp
        </button>
      </Link>
      </header>
    );
}
