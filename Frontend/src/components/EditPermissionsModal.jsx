import React, { useState, useEffect } from "react";

const EditPermissionsModal = ({
  selectedUser,
  handleUpdatePermissions,
  setSelectedUser,
}) => {
  const [formData, setFormData] = useState({ ...selectedUser });

  useEffect(() => {
    setFormData({ ...selectedUser });
  }, [selectedUser]);

  // Automatically turn off "canTrain" and "canPredict" when "isApproved" is false
  useEffect(() => {
    if (!formData.isApproved) {
      setFormData((prev) => ({
        ...prev,
        canTrain: false,
        canPredict: false,
      }));
    }
  }, [formData.isApproved]);

  const handleToggleChange = (name) => {
    setFormData((prev) => {
      // Prevent toggling "canTrain" or "canPredict" if "isApproved" is false
      if (!formData.isApproved && (name === "canTrain" || name === "canPredict")) {
        return prev; // No state change
      }

      // Toggle the value for the specified field
      return {
        ...prev,
        [name]: !prev[name],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePermissions(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Permissions</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Can Predict</label>
            <div
              onClick={() => handleToggleChange("canPredict")}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                formData.canPredict ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform ${
                  formData.canPredict ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Can Train</label>
            <div
              onClick={() => handleToggleChange("canTrain")}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                formData.canTrain ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform ${
                  formData.canTrain ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Approved</label>
            <div
              onClick={() => handleToggleChange("isApproved")}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                formData.isApproved ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform ${
                  formData.isApproved ? "translate-x-6" : ""
                }`}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
