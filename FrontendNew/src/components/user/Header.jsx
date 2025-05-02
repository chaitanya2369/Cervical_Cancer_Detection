import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Header = ({ backText = "Back", title = "Patient Details" }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { auth,loading,logout } = useAuth(); 

  if (loading){
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  } // or a loading spinner
  const user = auth.user; // Assuming auth.user contains the user data

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // -1;
    console.log("Logout clicked");
    logout(); // Call the logout function from the auth context
    navigate("/login");
  };

  const handleViewProfile = () => {
    console.log("View Profile clicked");
    navigate("/user/profile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    console.log(user);

    if(!user) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    } // or a loading spinner
  return (
    <header className="bg-transparent p-4 flex items-center justify-between">
      {/* Left Section - Back Button */}

      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Right Section - Icons and Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative bg-gray-200 p-3 rounded-md" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <img
              src="/images/review2.png"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex  items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                {user.Name}
              </span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul className="py-1">
                <li
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleViewProfile}
                >
                  View Profile
                </li>
                <li
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
