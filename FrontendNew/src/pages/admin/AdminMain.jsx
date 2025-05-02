import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Settings,
  User,
  Edit,
} from "lucide-react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import ViewUsers from "../../components/admin/ViewUsers";
import PagesHeader from "../../components/general/PagesHeader";
import ProfileAdmin from "../../components/admin/ProfileAdmin";
import AddOrEditFields from "../../components/admin/AddOrEditFields";

const AdminMain = () => {
  const [activeItemId, setactiveItemId] = useState("dashboard");
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
    { id: "profile", text: "Profile", icon: <User size={20} /> },
    {
      id: "add or Edit Fields",
      text: "Add or Edit Fields",
      icon: <Edit size={20} />,
    },
  ];

  const renderContent = () => {
    if (activeItemId == "dashboard") {
      return <AdminDashboard />;
    } else if (activeItemId == "users") {
      return <ViewUsers />;
    } else if (activeItemId == "profile") {
      return <ProfileAdmin />;
    } else if (activeItemId == "add or Edit Fields") {
      return <AddOrEditFields />;
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
          <PagesHeader
            title={activeItemId.charAt(0).toUpperCase() + activeItemId.slice(1)}
          />
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminMain;
