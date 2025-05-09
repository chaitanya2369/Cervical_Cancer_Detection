import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCircle, User, Edit } from "lucide-react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import ViewUsers from "../../components/admin/ViewUsers";
import PagesHeader from "../../components/general/PagesHeader";
import ProfileAdmin from "../../components/admin/ProfileAdmin";
import AddOrEditFields from "../../components/admin/AddOrEditFields";
import { useAuth } from "../../context/auth";

const AdminMain = () => {
  const { auth, loading } = useAuth();
  const [activeItemId, setActiveItemId] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL-based active item selection
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const urlItemId = pathParts[pathParts.length - 1];

    // Handle the case where the URL is exactly "/admin"
    if (location.pathname === "/admin" || urlItemId === "admin") {
      setActiveItemId("dashboard");
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const validItemIds = items.map((item) => item.id);
    if (validItemIds.includes(urlItemId) && urlItemId !== activeItemId) {
      setActiveItemId(urlItemId);
    } else if (!validItemIds.includes(urlItemId)) {
      setActiveItemId("dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, activeItemId, navigate]);

  // Navigate when activeItemId changes
  useEffect(() => {
    navigate("/admin/" + activeItemId);
  }, [activeItemId, navigate]);

  // Handle role-based navigation after hooks
  useEffect(() => {
    if (!loading && auth?.role !== "admin") {
      if (auth?.role) navigate("/unauthorized", { replace: true });
      else navigate("/login", { replace: true });
    }
  }, [loading, auth, navigate]);

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
  };

  const items = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "users", text: "Users", icon: <UserCircle size={20} /> },
    { id: "profile", text: "Profile", icon: <User size={20} /> },
    {
      id: "addOrEditFields",
      text: "Add or Edit Fields",
      icon: <Edit size={20} />,
    },
  ];

  const renderContent = () => {
    if (activeItemId === "dashboard") {
      return <AdminDashboard />;
    } else if (activeItemId === "users") {
      return <ViewUsers />;
    } else if (activeItemId === "profile") {
      return <ProfileAdmin />;
    } else if (activeItemId === "addOrEditFields") {
      return <AddOrEditFields />;
    } else {
      return <h2>Select an item from the sidebar</h2>;
    }
  };

  const getTitle = () => {
    const activeItem = items.find((item) => item.id === activeItemId);
    return activeItem ? activeItem.text : "Dashboard";
  };

  // Render loading state or nothing until checks are complete
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // If not an admin, return null (navigation handled by useEffect)
  if (auth?.role !== "admin") {
    return null;
  }

  return (
    <div>
      <div className="flex">
        <SideNavBar>
          {items.map((item) => (
            <SideBarItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              active={activeItemId === item.id}
              onClick={() => handleItemClick(item.id)}
              aria-current={activeItemId === item.id ? "page" : undefined}
              aria-label={`Navigate to ${item.text}`}
            />
          ))}
        </SideNavBar>
        <main className="w-screen h-screen">
          <PagesHeader
            title={getTitle()}
            aria-label={`Page header for ${getTitle()}`}
          />
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminMain;
