export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-2xl font-bold text-teal-600">Cervi<span className="text-black">Scan</span></div>
        <nav className="space-x-6">
          <a href="#" className="text-gray-600 font-bold hover:text-teal-600">Home</a>
          <a href="#" className="text-gray-600 font-bold hover:text-teal-600">About</a>
          <a href="#" className="text-gray-600 font-bold hover:text-teal-600">Services</a>
          <a href="#" className="text-gray-600 font-bold hover:text-teal-600">Blogs</a>
          <a href="#" className="text-gray-600 font-bold hover:text-teal-600">Contact</a>
        </nav>
        <button className= "p-2 text-white font-semibold bg-teal-600 hover:bg-teal-400 rounded-xl">Login / SignUp</button>
      </header>
    );
  }