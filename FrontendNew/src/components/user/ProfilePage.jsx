import React, { useState, useEffect } from "react";
import Modal from "../general/Modal"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Loader, User, Mail, Building, Lock, Image as ImageIcon } from "lucide-react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { auth,setAuth,loading,updateCookies } = useAuth();
  const navigate = useNavigate();

  if(loading){
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  } // or a loading spinner

  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("/images/review1.png");
  // const [loading, setLoading] = useState(true);

  // Redirect if user is not logged in and setup initial data
  useEffect(() => {
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else {
      setUserData(auth.user);
      setEditedData({
        ID: auth.user.ID,
        Name: auth.user.Name,
        Email: auth.user.Email,
        Hospital: auth.user.Hospital,
        Password: auth.user.Password,
        Status: auth.user.Status,
        canTrain: auth.user.CanTrain || false,
        canPredict: auth.user.CanPredict || false,
        profileImage: auth.user.profileImage || "/images/review.png",
      });

      if (auth.user.profileImage) {
        setPreviewImage(auth.user.profileImage);
      }

      // const timer = setTimeout(() => {
      //   setLoading(false);
      // }, 1000);

      // return () => clearTimeout(timer);
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
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
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
  const ID = auth.user.ID;
  console.log(ID)
  const handleSave = async () => {
    // Validation
    if (!editedData.Name) {
      alert("Please enter a valid name.");
      return;
    }
  
    try {
      const response = await axios.put(`${SERVER_URL}/user/edit-details`,editedData);
      if (response.data.success) {
        setAuth((prev) => ({
          ...prev,
          user: {...response.data.user },
        }));
        updateCookies({
          user: { ...response.data.user },
          role: auth.role,
          token: auth.token,
        });
        setUserData(editedData);
        setIsEditModalOpen(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + (error.message || "Unknown error"));
    }
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
  console.log(userData)
  return (
    <div className="m-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Gradient and Profile Image */}
        <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={userData.profileImage || "/images/review1.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{userData.Name}</h2>
              <p className="text-gray-600">{userData.Email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
              {userData.Name}
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Organisation</label>
            <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
              {userData.Hospital}
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <img
                src={userData.profileImage || "/images/review1.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
              {userData.Email}
            </span>
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
            <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
              {userData.Status.charAt(0).toUpperCase() + userData.Status.slice(1)}
            </span>
          </div>
          <div className="flex space-x-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Can Train</label>
              <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
                {userData.CanTrain ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Can Predict</label>
              <span className="w-full p-2 border-gray-200 rounded-lg shadow-sm bg-gray-50">
                {userData.CanPredict ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile"
          onSave={handleSave}
        >
          <div className="p-6">
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-600" />
              Profile Information
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-teal-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={editedData.Name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-teal-600" />
                  Email Address
                </label>
                <input
                  type="text"
                  value={editedData.Email || ""}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Building className="w-4 h-4 mr-1 text-teal-600" />
                  Organisation
                </label>
                <input
                  type="text"
                  value={editedData.Hospital || ""}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-teal-600" />
                  Status
                </label>
                <input
                  type="text"
                  value={editedData.Status.charAt(0).toUpperCase() + editedData.Status.slice(1)}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1 text-teal-600" />
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-500 file:text-white hover:file:bg-teal-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-teal-600" />
                  Can Train
                </label>
                <input
                  type="text"
                  value={editedData.canTrain ? "Yes" : "No"}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-teal-600" />
                  Can Predict
                </label>
                <input
                  type="text"
                  value={editedData.canPredict ? "Yes" : "No"}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

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
