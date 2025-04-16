import React from "react";

const ViewPatientHeader = () => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left Section - Back Button */}
      <div className="flex items-center space-x-2">
        <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
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
          <span className="text-sm font-medium">Back to Patient List</span>
        </button>
      </div>

      {/* Center Section - Title */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">Patient Details</h1>
      </div>

      {/* Right Section - Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Bell Icon */}
        <button className="text-gray-600 hover:text-gray-800 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a7.98 7.98 0 00-1.741-4.979L16 6m-4 4V3a2 2 0 00-2-2h-4a2 2 0 00-2 2v6l2.303 1.838A7.98 7.98 0 0110 11v3.158c0 .513-.301.988-.809 1.437L6 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H6"
            />
          </svg>
        </button>

        {/* Settings Icon */}
        <button className="text-gray-600 hover:text-gray-800 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/images/review2.png" // Replace with actual profile image path
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">
              Alfredo Westervelt
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
        </div>
      </div>
    </header>
  );
};

export default ViewPatientHeader;