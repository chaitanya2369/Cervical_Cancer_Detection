import React, { useState, useEffect, useRef } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const PagesHeader = ({ backText = "Back", title = "Patient Details" }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { auth, logout } = useAuth();
  console.log(auth);

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
    navigate("/", { replace: true });
  };

  const handleViewProfile = () => {
    console.log("View Profile clicked");
    navigate("/super-admin/profile");
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

  return (
    <header className="bg-transparent p-4 flex items-center justify-between">
      {/* Left Section - Dynamic Back Button */}
      {/* <div className="flex items-center space-x-2">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">{backText}</span>
        </button>
      </div> */}

      {/* Center Section - Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* Right Section - Icons and Profile */}
      <div className="flex items-center space-x-4 bg-themeDarkGray rounded-xl p-3">
        <div className="relative" ref={dropdownRef}>
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
                {auth.user ? auth.user.Name : ""}
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

export default PagesHeader;
