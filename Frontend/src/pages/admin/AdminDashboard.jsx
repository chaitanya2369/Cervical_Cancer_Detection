import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader";
import Overview from "../../components/Overview";
import UserManagement from "../../components/UserManagement";
import EditPermissionsModal from "../../components/EditPermissionsModal";
import AddUserForm from "../../components/AddUserForm";

const AdminDashboard = () => {
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("all");
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Fetch users for unapproved and approved
  const fetchUsers = async () => {
    try {
      const unapprovedResponse = await axios.get(
        "http://localhost:8080/admin/get-un-users"
      );
      setUnapprovedUsers(unapprovedResponse.data?.users || []);

      const approvedResponse = await axios.get(
        "http://localhost:8080/admin/get-ap-users"
      );
      setApprovedUsers(approvedResponse.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUnapprovedUsers([]);
      setApprovedUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Define filteredUsers directly based on tab
  const filteredUsers = tab === "approved" 
    ? approvedUsers 
    : tab === "unapproved" 
    ? unapprovedUsers 
    : [...approvedUsers, ...unapprovedUsers];

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
  };

  const handleUpdatePermissions = async (updatedUser) => {
    try {
      await axios.post("http://localhost:8080/admin/approve-user", updatedUser);
      alert("User permissions updated successfully!");
      fetchUsers();  // Refresh user list after update
      setSelectedUser(null); // Close modal
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update user permissions. Please try again.");
    }
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true); // Open Add User Modal
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false); // Close Add User Modal
  };

  const handleAddUserData = async (userDetails) => {
    try {
      await axios.post("http://localhost:8080/admin/add-user", userDetails);
      alert("User added successfully!");
      fetchUsers(); // Refresh user list after adding
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-1">
          <aside className="w-64 bg-white shadow-md">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "overview" ? "bg-blue-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => setView("overview")}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "users" ? "bg-blue-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => setView("users")}
                  >
                    User Management
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            {view === "overview" && <Overview />}
            {view === "users" && (
              <UserManagement
                tab={tab}
                setTab={setTab}
                filteredUsers={filteredUsers} // Pass directly
                handleEditPermissions={handleEditPermissions}
                handleAddUser={handleAddUser}
              />
            )}
          </main>
        </div>
        {selectedUser && (
          <EditPermissionsModal
            selectedUser={selectedUser}
            handleUpdatePermissions={handleUpdatePermissions}
            setSelectedUser={setSelectedUser}
          />
        )}
        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <AddUserForm
            setIsAddUserOpen={setIsAddUserModalOpen}
            handleAddUser={handleCloseAddUserModal} 
            handleAddUserData={handleAddUserData}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
