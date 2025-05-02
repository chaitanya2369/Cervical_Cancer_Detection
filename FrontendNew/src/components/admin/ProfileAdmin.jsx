import React, { useState } from "react";
import Modal from "../general/Modal"; // Adjust path as needed
import { useAuth } from "../../context/auth";
import { Heading1 } from "lucide-react";
import axios from "axios";

const ProfileAdmin = () => {
  const { auth, setAuth, loading, updateCookies } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>; // Show loading state if needed
  }
  console.log("user", auth.user);
  const SERVER_URL = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState({
    ...auth.user,
    profileImage: "/images/review1.png",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(userData.profileImage);

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

  const handleSave = async () => {
    setUserData((prev) => ({
      ...prev,
      ...editedData,
      profileImage: previewImage,
    }));
    console.log("editedData", editedData);
    const resp = await axios.put(
      `${SERVER_URL}/admin/edit-details`,
      editedData
    );
    if (resp.data.success) {
      console.log("Profile updated successfully:", resp.data);
      setAuth((prev) => ({ ...prev, user: { ...resp.data.admin } }));
      updateCookies({
        user: { ...resp.data.admin },
        role: auth.role,
        token: auth.token,
      });
    }

    setIsEditMode(false);
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
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
    ${
      isEditMode
        ? "bg-gray-200 peer-checked:bg-teal-500"
        : "bg-gray-200 opacity-50 cursor-not-allowed"
    }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200
      ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>

      <span className="ml-3 text-gray-700 text-sm font-medium">
        {checked ? "Yes" : "No"}
      </span>
    </label>
  );

  return (
    <div className="m-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Gradient and Profile Image */}
        <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={isEditMode ? previewImage : userData.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {userData.Name}
              </h2>
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
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
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
            <label className="block text-gray-700 font-semibold mb-2">
              Organisation
            </label>
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
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={isEditMode ? previewImage : userData.profileImage}
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
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <div className="flex items-center space-x-2">
              <span className="w-full p-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100">
                {userData.Email}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Change Password
            </button>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Status
            </label>
            <select
              name="Status"
              value={isEditMode ? editedData.Status : userData.Status}
              onChange={handleInputChange}
              disabled={true}
              className="w-full p-2  border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50 disabled:bg-gray-100"
            >
              <option value="approved">Approved</option>
              <option value="unapproved">UnApproved</option>
            </select>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        {isEditMode && (
          <div className="p-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsEditMode(false);
                setPreviewImage(userData.profileImage);
                setEditedData({ ...userData });
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
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
        title="Change Password"
        onSave={handleUpdatePassword}
        saveButtonText="Update Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Current Password
            </label>
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
            <label className="block text-gray-700 font-semibold mb-1">
              New Password
            </label>
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
            <label className="block text-gray-700 font-semibold mb-1">
              Confirm New Password
            </label>
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

export default ProfileAdmin;
