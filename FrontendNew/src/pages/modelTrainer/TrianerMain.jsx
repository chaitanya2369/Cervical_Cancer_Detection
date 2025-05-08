import React, { useEffect, useState } from "react";
import SideNavBar, { SideBarItem } from "../../components/general/SideNavBar";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Eye,
  Settings,
  User,
  FileText,
} from "lucide-react";

import PagesHeader from "../../components/general/PagesHeader";

// Trainer-specific components
import TrainerDashboard from "../../components/modeltrainer/TrainerDashboard";
import ViewDatasets from "../../components/modelTrainer/ViewDatasets";
import TrainModel from "../../components/modeltrainer/TrainModel";
import ProfileTrainer from "../../components/modeltrainer/ProfileTrainer";

const TrainerMain = () => {
  const [activeItemId, setActiveItemId] = useState("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId);
  };

  useEffect(() => {
    navigate("/trainer/" + activeItemId);
  }, [activeItemId]);

  const items = [
    { id: "dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} /> },
    // { id: "datasets", text: "View Datasets", icon: <Eye size={20} /> },
    { id: "train-model", text: "Train Model", icon: <Upload size={20} /> },
    { id: "profile", text: "Profile", icon: <User size={20} /> },
  ];

  const renderContent = () => {
    switch (activeItemId) {
      case "dashboard":
        return <TrainerDashboard />;
      case "datasets":
        return <ViewDatasets />;
      case "train-model":
        return <TrainModel />;
      case "profile":
        return <ProfileTrainer />;
      default:
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
            active={activeItemId === item.id}
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

export default TrainerMain;
