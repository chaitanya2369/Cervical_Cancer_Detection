import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import UserDashboard from "../../components/user/UserDashboard";
import ViewPatients from "../../components/user/ViewPatients";
import { LayoutDashboard, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PagesHeader from "../../components/general/PagesHeader";

const UserMain = () => {
  const [activeItemId, setActiveItemId] = useState("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
  };

  useEffect(() => {
    navigate("/user/" + activeItemId);
  }, [activeItemId, navigate]);

  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "patients", text: "Patients", icon: <UserCircle size={20} /> },
    { id: "settings", text: "Settings", icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeItemId) {
      case "dashboard":
        return <UserDashboard />;
      case "patients":
        return <ViewPatients />;
      case "settings":
        return null; // Placeholder for settings content
      default:
        return <h2>Select an item from the sidebar</h2>;
    }
  };

  // Determine backText and title based on activeItemId
  const getHeaderProps = () => {
    switch (activeItemId) {
      case "dashboard":
        return { backText: "Home", title: "Dashboard" };
      case "patients":
        return { backText: "Dashboard", title: "Patients" };
      case "settings":
        return { backText: "Dashboard", title: "Settings" };
      default:
        return { backText: "Back", title: "User Main" };
    }
  };

  const { backText, title } = getHeaderProps();

  return (
    <div className="flex">
      <SideNavBar>
        {items.map((item) => (
          <SideBarItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            active={activeItemId === item.id}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </SideNavBar>
      <main className="flex-1 h-screen overflow-auto">
        <PagesHeader backText={backText} title={title} />
        {renderContent()}
      </main>
    </div>
  );
};

export default UserMain;
