import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  // Hardcoded data for the super admin dashboard
  const { auth, loading } = useAuth();
  if (loading) {
    return <h1>Loading..</h1>;
  }

  const dashboardData = {
    totalOrganizations: 10,
    totalUsers: 150,
    totalAdmins: 25,
    totalPredictions: 320,
    totalPatients: 200,
    activeOrganizations: 8,
    pendingApprovals: 15,
  };

  return (
    <div className="p-6 h-screen bg-gray-100">
      <Typography variant="h2" className="mb-6">
        Welcome {auth.user.Name}!
      </Typography>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Organizations */}
        <Card className="p-6 bg-blue-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Organizations
          </Typography>
          <Typography variant="h3" color="blue">
            {dashboardData.totalOrganizations}
          </Typography>
        </Card>

        {/* Total Users */}
        <Card className="p-6 bg-green-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Users
          </Typography>
          <Typography variant="h3" color="green">
            {dashboardData.totalUsers}
          </Typography>
        </Card>

        {/* Total Admins */}
        <Card className="p-6 bg-yellow-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Admins
          </Typography>
          <Typography variant="h3" color="yellow">
            {dashboardData.totalAdmins}
          </Typography>
        </Card>

        {/* Total Predictions */}
        <Card className="p-6 bg-purple-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Predictions Made
          </Typography>
          <Typography variant="h3" color="purple">
            {dashboardData.totalPredictions}
          </Typography>
        </Card>

        {/* Total Patients */}
        <Card className="p-6 bg-teal-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Total Patients
          </Typography>
          <Typography variant="h3" color="teal">
            {dashboardData.totalPatients}
          </Typography>
        </Card>

        {/* Active Organizations */}
        <Card className="p-6 bg-indigo-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Active Organizations
          </Typography>
          <Typography variant="h3" color="indigo">
            {dashboardData.activeOrganizations}
          </Typography>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-6 bg-red-50">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Pending Approvals
          </Typography>
          <Typography variant="h3" color="red">
            {dashboardData.pendingApprovals}
          </Typography>
          <Link to="/view-patients">
            <Button color="red" size="sm" className="mt-2">
              Review Approvals
            </Button>
          </Link>
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

export default Dashboard;
