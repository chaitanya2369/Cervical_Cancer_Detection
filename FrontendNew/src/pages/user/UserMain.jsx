import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import UserDashboard from "../../components/user/UserDashboard";
import ViewPatients from "../../components/user/ViewPatients";
import { LayoutDashboard, UserCircle, User, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Profile from "../../components/user/ProfilePage";
import TrainingData from "../../components/user/TrainingData";
import { useAuth } from "../../context/auth";

const UserMain = () => {
  const { auth, loading } = useAuth();
  const [activeItemId, setActiveItemId] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL-based active item selection
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const urlItemId = pathParts[pathParts.length - 1];

    // Handle the case where the URL is exactly "/user"
    if (location.pathname === "/user" || urlItemId === "user") {
      setActiveItemId("dashboard");
      navigate("/user/dashboard", { replace: true });
      return;
    }

    const validItemIds = items.map((item) => item.id);
    if (validItemIds.includes(urlItemId) && urlItemId !== activeItemId) {
      setActiveItemId(urlItemId);
    } else if (!validItemIds.includes(urlItemId)) {
      setActiveItemId("dashboard");
      navigate("/user/dashboard", { replace: true });
    }
  }, [location.pathname, activeItemId, navigate]);

  // Navigate when activeItemId changes
  useEffect(() => {
    navigate("/user/" + activeItemId);
  }, [activeItemId, navigate]);

  // Handle role-based navigation after hooks
  useEffect(() => {
    if (!loading && auth?.role !== "user") {
      if (auth?.role) navigate("/unauthorized", { replace: true });
      else navigate("/login", { replace: true });
    }
  }, [loading, auth, navigate]);

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
  };

  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "patients", text: "Patients", icon: <UserCircle size={20} /> },
    { id: "profile", text: "Profile", icon: <User size={20} /> },
    {
      id: "formatandupload",
      text: "Format & Upload",
      icon: <Upload size={20} />,
    },
  ];

  const renderContent = () => {
    switch (activeItemId) {
      case "dashboard":
        return <UserDashboard />;
      case "patients":
        return <ViewPatients />;
      case "profile":
        return <Profile />;
      case "formatandupload":
        return <TrainingData />;
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
      case "formatandupload":
        return { backText: "Dashboard", title: "View Format and Train Data" };
      case "profile":
        return { backText: "Dashboard", title: "Profile" };
      default:
        return { backText: "Back", title: "User Main" };
    }
  };

  const { backText, title } = getHeaderProps();

  // Render loading state or nothing until checks are complete
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // If not a user, return null (navigation handled by useEffect)
  if (auth?.role !== "user") {
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
      <main className="flex-1 h-screen overflow-auto">
        <Header
          backText={backText}
          title={title}
          aria-label={`Page header for ${title}`}
        />
        {renderContent()}
      </main>
    </div>
  );
};

export default UserMain;
