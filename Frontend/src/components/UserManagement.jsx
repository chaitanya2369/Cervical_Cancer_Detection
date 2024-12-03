import React from "react";

const UserManagement = ({
  tab,
  setTab,
  filteredUsers,
  handleEditPermissions,
  handleAddUser,
  handleToggleApproval, 
}) => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>

      {/* Tab Filter Section */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab("all")}
          className={`py-2 px-4 rounded ${
            tab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`py-2 px-4 rounded ${
            tab === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Approved Users
        </button>
        <button
          onClick={() => setTab("unapproved")}
          className={`py-2 px-4 rounded ${
            tab === "unapproved" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Unapproved Users
        </button>
      </div>

      {/* User Table Section */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Approved Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id || `${user.Name}-${user.Role}`}>
                <td className="p-2">{user.Name}</td>
                <td className="p-2">{user.Email}</td>
                <td className="p-2">{user.Role}</td>
                <td className="p-2">
                  <button
                    className={`py-2 px-4 rounded ${
                      user.IsApproved
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                    onClick={() => handleToggleApproval(user)}
                  >
                    {user.IsApproved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditPermissions(user)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
