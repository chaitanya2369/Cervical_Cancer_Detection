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
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
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
