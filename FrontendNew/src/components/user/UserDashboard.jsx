import React, { useState, useEffect } from "react";
import Modal from "../general/Modal"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Loader } from "lucide-react";

const UserDashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user = auth.user;
  const [loading, setLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState({
    totalPredictions: 15,
    recentPredictions: [
      { id: 1, type: "AF", date: "2025-04-15", result: "Positive", confidence: 0.92 },
      { id: 2, type: "DIC", date: "2025-04-14", result: "Negative", confidence: 0.85 },
      { id: 3, type: "AF", date: "2025-04-12", result: "Positive", confidence: 0.88 },
      { id: 4, type: "AF", date: "2025-04-12", result: "Positive", confidence: 0.88 },
    ],
    appointments: [
      { id: 1, date: "2025-04-20", time: "10:00 AM", doctor: "Dr. Smith" },
      { id: 2, date: "2025-04-22", time: "2:00 PM", doctor: "Dr. Jones" },
    ],
    healthSummary: {
      avgWaitTime: "15 min",
      lastCheckup: "2025-03-10",
      status: "Stable",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    // Check authentication status
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else {
      // Simulate loading user data
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [auth.user, navigate]);

  const handleViewDetails = (prediction) => {
    setSelectedPrediction(prediction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrediction(null);
  };

  // Show loading spinner while checking auth or loading data
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // If we get here, user is authenticated and data is loaded
  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back, {user.Name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Predictions Card */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Predictions</h3>
          <p className="text-3xl font-bold text-teal-600">{dashboardData.totalPredictions}</p>
        </div>

        {/* Recent Predictions Card */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Predictions</h3>
          <ul className="space-y-3">
            {dashboardData.recentPredictions.map((pred) => (
              <li
                key={pred.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>
                  {pred.type} - {pred.date} ({pred.result})
                </span>
                <button
                  onClick={() => handleViewDetails(pred)}
                  className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for Prediction Details */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCloseModal}
        title="Prediction Details"
        width="max-w-xl"
      >
        {selectedPrediction && (
          <div className="space-y-4">
            <p><strong>Type:</strong> {selectedPrediction.type}</p>
            <p><strong>Date:</strong> {selectedPrediction.date}</p>
            <p><strong>Result:</strong> {selectedPrediction.result}</p>
            <p><strong>Confidence:</strong> {selectedPrediction.confidence * 100}%</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;
