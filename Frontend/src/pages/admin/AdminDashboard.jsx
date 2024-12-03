import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader";  
import Overview from "../../components/Overview";  
import UserManagement from "../../components/UserManagement"; 
import EditPermissionsModal from "../../components/EditPermissionsModal";
import AddUserForm from "../../components/addUserForm";  

const AdminDashboard = () => {
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("all");
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
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

    fetchUsers();
  }, []);

  // Define filteredUsers based on the selected tab
  const filteredUsers = () => {
    if (tab === "approved") {
      return approvedUsers;
    } else if (tab === "unapproved") {
      return unapprovedUsers;
    }
    return [...approvedUsers, ...unapprovedUsers];
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
  };

  const handleUpdatePermissions = async (updatedUser) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/approve-user",
        updatedUser
      );
      alert("User permissions updated successfully!");
      // Refresh the users list after updating
      const unapprovedResponse = await axios.get(
        "http://localhost:8080/admin/get-un-users"
      );
      const approvedResponse = await axios.get(
        "http://localhost:8080/admin/get-ap-users"
      );
      setUnapprovedUsers(unapprovedResponse.data?.users || []);
      setApprovedUsers(approvedResponse.data?.users || []);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update user permissions. Please try again.");
    }
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true); // Open the Add User modal
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false); // Close the Add User modal
  };
  const handleAddUserData = async (userDetails)=>{
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/add-user",
        userDetails
      );
      alert("User added successfully!");
      // Refresh the users list after adding
      const updatedUnapprovedUsers = await axios.get(
        "http://localhost:8080/admin/get-un-users"
      );
      setUnapprovedUsers(updatedUnapprovedUsers.data?.users || []);
      const updatedApprovedUsers = await axios.get(
        "http://localhost:8080/admin/get-ap-users"
      );
      setUnapprovedUsers(updatedApprovedUsers.data?.users || []);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }

  }
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
                      view === "overview"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => setView("overview")}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "users"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600"
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
                filteredUsers={filteredUsers()} // Pass the result directly
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
