import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const handleBack = () => {
    const role = auth.role == "super-admin" ? "superadmin" : auth.role;
    navigate("/" + role + "/dashboard");
  };

  return (
    <div className="p-6 h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Typography variant="h2" color="red" className="mb-4">
          Access Denied
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="mb-6">
          You do not have permission to access this page.
        </Typography>
        <Link onClick={handleBack}>
          <Button color="blue">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
