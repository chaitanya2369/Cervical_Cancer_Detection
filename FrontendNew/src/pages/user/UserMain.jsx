import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import UserDashboard from "../../components/user/UserDashboard";
import ViewPatients from "../../components/user/ViewPatients";
import { LayoutDashboard, UserCircle, Settings,User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewAdmins from "../../components/SuperAdmin/ViewAdmins";
import Header from "../../components/user/Header";
import Profile from "../../components/user/ProfilePage";

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
    { id: "profile", text:"Profile", icon:<User size={20}/>}
  ];

  const renderContent = () => {
    switch (activeItemId) {
      case "dashboard":
        return <UserDashboard />;
      case "patients":
        return <ViewPatients />;
      case "profile":
        return <Profile />;
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
      case "profile":
        return { backText: "Dashboard", title: "Profile" };
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
        <Header backText={backText} title={title} />
        {renderContent()}
      </main>
    </div>
  );
};

export default UserMain;