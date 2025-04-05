export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-3xl font-bold text-black">Cervi<span className="text-teal-600">Scan</span></div>
        <nav className="space-x-9">
          <a href="#" className="text-gray-600 font-bold text-xl hover:text-teal-600">Home</a>
          <a href="#" className="text-gray-600 font-bold text-xl hover:text-teal-600">About</a>
          <a href="#" className="text-gray-600 font-bold text-xl hover:text-teal-600">Services</a>
          <a href="#" className="text-gray-600 font-bold text-xl hover:text-teal-600">Blogs</a>
          <a href="#" className="text-gray-600 font-bold text-xl hover:text-teal-600">Contact</a>
        </nav>
        <button className= "px-6 py-2 mr-7 text-white font-semibold bg-teal-600 hover:bg-teal-400 rounded-xl">Login / SignUp</button>
      </header>
    );
  }