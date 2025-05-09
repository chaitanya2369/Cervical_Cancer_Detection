import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import Dashboard from "../../components/SuperAdmin/Dashboard";
import { LayoutDashboard, UserCircle, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ViewAdmins from "../../components/SuperAdmin/ViewAdmins";
import PagesHeader from "../../components/general/PagesHeader";
import Profile from "../../components/SuperAdmin/ProfileSuperAdmin";
import { useAuth } from "../../context/auth";

const SuperAdminMain = () => {
  const { auth, loading } = useAuth();
  const [activeItemId, setActiveItemId] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL-based active item selection
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const urlItemId = pathParts[pathParts.length - 1];

    const validItemIds = items.map((item) => item.id);
    if (validItemIds.includes(urlItemId) && urlItemId !== activeItemId) {
      setActiveItemId(urlItemId);
    } else if (!validItemIds.includes(urlItemId)) {
      setActiveItemId("dashboard");
      navigate("/superadmin/dashboard", { replace: true });
    }
  }, [location.pathname, activeItemId, navigate]);

  // Navigate when activeItemId changes
  useEffect(() => {
    navigate("/superadmin/" + activeItemId);
  }, [activeItemId, navigate]);

  // Handle role-based navigation after hooks
  useEffect(() => {
    if (!loading && auth?.role !== "super-admin") {
      if (auth?.role) navigate("/unauthorized", { replace: true });
      else navigate("/login", { replace: true });
    }
  }, [loading, auth, navigate]);

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
  };

  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "admins", text: "Admins", icon: <UserCircle size={20} /> },
    { id: "profile", text: "Profile", icon: <User size={20} /> },
  ];

  const renderContent = () => {
    if (activeItemId === "dashboard") {
      return <Dashboard />;
    } else if (activeItemId === "admins") {
      return <ViewAdmins />;
    } else if (activeItemId === "profile") {
      return <Profile />;
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

  // If not a super-admin, return null (navigation handled by useEffect)
  if (auth?.role !== "super-admin") {
    return null;
  }

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
  );
};

export default SuperAdminMain;
