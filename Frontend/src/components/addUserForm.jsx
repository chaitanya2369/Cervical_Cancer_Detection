import React, { useState } from "react";
import Switch from "react-switch";
const AddUserForm = ({ setIsAddUserOpen, handleAddUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    isApproved: false,
    canPredict: false,
    canTrain: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddUserData(formData);
    setIsAddUserOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add User</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          {/* Can Predict */}
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm">Can Predict</label>
            <Switch
              checked={formData.canPredict}
              onChange={() => handleToggleChange("canPredict")}
              offColor="#ddd"
              onColor="#4CAF50"
            />
          </div>
          {/* Can Train */}
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm">Can Train</label>
            <Switch
              checked={formData.canTrain}
              onChange={() => handleToggleChange("canTrain")}
              offColor="#ddd"
              onColor="#4CAF50"
            />
          </div>
          {/* Is Approved */}
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm">Approved</label>
            <Switch
              checked={formData.isApproved}
              onChange={() => handleToggleChange("isApproved")}
              offColor="#ddd"
              onColor="#4CAF50"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setIsAddUserOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
