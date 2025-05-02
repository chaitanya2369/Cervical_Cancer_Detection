import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const { auth, loading } = useAuth();
  if (loading) {
    return <h1>Loading..</h1>;
  }
  // Hardcoded data for the organization admin dashboard
  const orgId = auth.user.Hospital; // Replace with dynamic orgId (e.g., from context or props)
  const orgDashboardData = {
    totalUsers: 50,
    usersWithPredictionPermission: 20,
    usersWithTrainingPermission: 10,
    totalPredictions: 150,
    totalPatients: 80,
    pendingApprovals: 5,
    activeUsers: 45,
  };
  return (
    <div className="p-6 h-screen bg-gray-100">
      <Typography variant="h2" className="mb-6">
        Welcome Back {auth.user.Name}!
      </Typography>
      <Typography variant="h4" className="mb-4">
        Organization: {orgId}
      </Typography>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users in Organization */}
        <Card className="p-6 bg-blue-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Users
          </Typography>
          <Typography variant="h3" color="blue">
            {orgDashboardData.totalUsers}
          </Typography>
        </Card>

        {/* Users with Prediction Permission */}
        <Card className="p-6 bg-green-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Users with Prediction Permission
          </Typography>
          <Typography variant="h3" color="green">
            {orgDashboardData.usersWithPredictionPermission}
          </Typography>
        </Card>

        {/* Users with Training Permission */}
        <Card className="p-6 bg-yellow-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Users with Training Permission
          </Typography>
          <Typography variant="h3" color="yellow">
            {orgDashboardData.usersWithTrainingPermission}
          </Typography>
        </Card>

        {/* Total Predictions in Organization */}
        <Card className="p-6 bg-purple-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Predictions
          </Typography>
          <Typography variant="h3" color="purple">
            {orgDashboardData.totalPredictions}
          </Typography>
        </Card>

        {/* Total Patients in Organization */}
        <Card className="p-6 bg-teal-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Patients
          </Typography>
          <Typography variant="h3" color="teal">
            {orgDashboardData.totalPatients}
          </Typography>
        </Card>

        {/* Pending Approvals in Organization */}
        <Card className="p-6 bg-red-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Pending Approvals
          </Typography>
          <Typography variant="h3" color="red">
            {orgDashboardData.pendingApprovals}
          </Typography>
          <Link to="/view-patients">
            <Button color="red" size="sm" className="mt-2">
              Review Approvals
            </Button>
          </Link>
        </Card>

        {/* Active Users in Organization */}
        <Card className="p-6 bg-indigo-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Active Users
          </Typography>
          <Typography variant="h3" color="indigo">
            {orgDashboardData.activeUsers}
          </Typography>
        </Card>
      </div>

      {/* Additional Actions */}
      <div className="flex space-x-4">
        <Link to="/view-patients">
          <Button color="blue">View Patients</Button>
        </Link>
        <Link to="/add-or-edit-fields">
          <Button color="blue">Manage Fields</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
