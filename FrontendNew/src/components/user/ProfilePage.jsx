import React, { useState, useEffect } from "react";
import Modal from "../general/Modal"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Loader } from "lucide-react";

const Profile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("/images/review.png");
  const [loading, setLoading] = useState(true);

  // Redirect if user is not logged in and setup initial data
  useEffect(() => {
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else {
      setUserData(auth.user);
      // Initialize editedData with properly named fields
      setEditedData({
        Name: auth.user.Name,
        Email: auth.user.Email,
        Hospital: auth.user.Hospital,
        Status: auth.user.Status,
        canTrain: auth.user.canTrain || false,
        canPredict: auth.user.canPredict || false,
        profileImage: auth.user.profileImage || "/images/review.png"
      });
      
      // Set preview image if available
      if (auth.user.profileImage) {
        setPreviewImage(auth.user.profileImage);
      }
      
      // Simulate data loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [auth.user, navigate]);

  // Show loading if userData not ready
  if (loading || !userData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <p className="text-xl font-semibold text-gray-700">Loading profile data...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Update user data with edited values
    setUserData((prev) => ({
      ...prev,
      ...editedData,
      profileImage: previewImage,
    }));
    setIsEditMode(false);
    
    // Here you would typically make an API call to update the user profile
    console.log("Updated user data:", {...editedData, profileImage: previewImage});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setError("");
    // Simulate password update (replace with API call)
    console.log("Password updated:", passwordData.newPassword);
    setIsPasswordModalOpen(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        disabled={!isEditMode}
      />
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 peer-checked:bg-teal-500
          ${isEditMode ? "bg-gray-200 peer-checked:bg-teal-500" : "bg-gray-200 opacity-50 cursor-not-allowed"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <span className="ml-3 text-gray-700 text-sm font-medium">{checked ? "Yes" : "No"}</span>
    </label>
  );

  return (
    <div className="m-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Gradient and Profile Image */}
        <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={isEditMode ? previewImage : (userData.profileImage || "/images/review1.png")}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{userData.Name}</h2>
              <p className="text-gray-600">{userData.Email}</p>
            </div>
          </div>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="Name"
              value={isEditMode ? editedData.Name : userData.Name}
              onChange={handleInputChange}
              disabled={!isEditMode}
              className="w-full p-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Organisation</label>
            <input
              type="text"
              name="Hospital"
              value={isEditMode ? editedData.Hospital : userData.Hospital}
              onChange={handleInputChange}
              disabled={!isEditMode}
              className="w-full p-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100"
            />
          </div>
          <div className="">
            <label className="block text-gray-700 font-semibold mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <img
                src={isEditMode ? previewImage : (userData.profileImage || "/images/review1.png")}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
              {isEditMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-500 file:text-white hover:file:bg-teal-600"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <div className="flex items-center space-x-2">
              <span className="w-full p-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100">{userData.Email}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Change Password
            </button>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              name="Status"
              value={isEditMode ? editedData.Status : userData.Status}
              onChange={handleInputChange}
              disabled={!isEditMode}
              className="w-full p-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100"
            >
              <option value="active">Approved</option>
              <option value="inactive">UnApproved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex">
            <div className="mr-3">
              <label className="block text-gray-700 font-semibold mb-2">Can Train</label>
              <ToggleSwitch
                name="canTrain"
                checked={isEditMode ? editedData.canTrain : (userData.canTrain || false)}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Can Predict</label>
              <ToggleSwitch
                name="canPredict"
                checked={isEditMode ? editedData.canPredict : (userData.canPredict || false)}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        {isEditMode && (
          <div className="p-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsEditMode(false);
                // Reset edited data and preview image to current user data
                setEditedData({
                  Name: userData.Name,
                  Email: userData.Email,
                  Hospital: userData.Hospital,
                  Status: userData.Status,
                  canTrain: userData.canTrain || false,
                  canPredict: userData.canPredict || false,
                  profileImage: userData.profileImage || "/images/review1.png"
                });
                setPreviewImage(userData.profileImage || "/images/review1.png");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setError("");
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }}
        title="Change Password"
        onSave={handleUpdatePassword}
        saveButtonText="Update Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Confirm new password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
