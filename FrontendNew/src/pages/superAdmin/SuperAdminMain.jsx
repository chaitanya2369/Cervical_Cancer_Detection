import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import Dashboard from "../../components/SuperAdmin/Dashboard";
import { LayoutDashboard, UserCircle, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewAdmins from "../../components/SuperAdmin/ViewAdmins";
import PagesHeader from "../../components/general/PagesHeader";
import Profile from "../../components/SuperAdmin/Profile";

const SuperAdminMain = () => {
  const [activeItemId, setactiveItemId] = useState("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    setactiveItemId(itemId);
  };
  useEffect(() => {
    navigate("/superadmin/" + activeItemId);
  }, [activeItemId]);
  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "admins", text: "Admins", icon: <UserCircle size={20} /> },
    { id: "profile", text: "Profile", icon: <User size={20} /> },
  ];

  const renderContent = () => {
    if (activeItemId == "dashboard") {
      return <Dashboard />;
    } else if (activeItemId == "admins") {
      return <ViewAdmins />;
    } else if (activeItemId == "profile") {
      return <Profile />;
    } else {
      return <h2>Select an item from the sidebar</h2>;
    }
  };

  return (
    <div className="flex">
      <SideNavBar>
        {items.map((item) => (
          <SideBarItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            active={activeItemId == item.id}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </SideNavBar>
      <main className="w-screen h-screen">
        <PagesHeader
          title={activeItemId.charAt(0).toUpperCase() + activeItemId.slice(1)}
        />
        {renderContent()}
      </main>
    </div>
  );
};

export default SuperAdminMain;
