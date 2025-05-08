import React from "react";
import WebSiteIcon from "./WebSiteIcon";

const SideNavBar = ({ children }) => {
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="m-3 ml-6">
          <WebSiteIcon />
        </div>
        <ul className="flex-1 px-3">{children}</ul>
      </nav>
    </aside>
  );
};

export function SideBarItem({ icon, text, active, onClick }) {
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors
        ${
          active
            ? "bg-gradient-to-tr from-teal-300 to-teal-200 text-gray-800"
            // ? "bg-teal-300 text-gray-800"
            : "hover:bg-teal-100 text-gray-600"
        }
    `}
      onClick={onClick}
    >
      {icon}
      <span className="w-48 ml-3">{text}</span>
    </li>
  );
}

export default SideNavBar;
