import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCircle, Settings } from "lucide-react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import ViewUsers from "../../components/admin/ViewUsers";

const AdminMain = () => {
  const [activeItemId, setactiveItemId] = useState("/admin/dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    setactiveItemId(itemId);
  };
  useEffect(() => {
    navigate("/admin/" + activeItemId);
  }, [activeItemId]);
  const items = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "users", text: "Users", icon: <UserCircle size={20} /> },
    { id: "settings", text: "Settings", icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    if (activeItemId == "dashboard") {
      return <AdminDashboard />;
    } else if (activeItemId == "admins") {
      return <ViewUsers />;
    } else if (activeItemId == "settings") {
    } else {
      return <h2>Select an item from the sidebar</h2>;
    }
  };
  return (
    <div>
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
          <div className="flex justify-end">Admin</div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminMain;
