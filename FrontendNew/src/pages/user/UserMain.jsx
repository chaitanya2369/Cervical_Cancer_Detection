import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import UserDashboard from "../../components/user/UserDashboard";
import ViewPatients from "../../components/user/ViewPatients";
import { LayoutDashboard, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewAdmins from "../../components/SuperAdmin/ViewAdmins";

const UserMain = () => {
  const [activeItemId, setactiveItemId] = useState("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    setactiveItemId(itemId);
  };
  useEffect(() => {
    navigate("/user/" + activeItemId);
  }, [activeItemId]);
  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "patients", text: "Patients", icon: <UserCircle size={20} /> },
    { id: "settings", text: "Settings", icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    if (activeItemId == "dashboard") {
      return <UserDashboard />;
    } else if (activeItemId == "patients") {
      return <ViewPatients />;
    } else if (activeItemId == "settings") {
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
        <div className="flex justify-end">User</div>
        {renderContent()}
      </main>
    </div>
  );
};

export default UserMain;
