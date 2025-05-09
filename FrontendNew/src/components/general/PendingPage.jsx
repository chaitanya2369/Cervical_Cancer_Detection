import React from "react";
import { Card, Typography } from "@material-tailwind/react";

const PendingPage = () => {
  return (
    <div className="p-6 h-screen bg-gray-100 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full text-center">
        <Typography variant="h3" color="blue-gray" className="mb-4">
          Account Not Approved
        </Typography>
        <Typography variant="paragraph" color="blue-gray">
          Your account has not been approved yet. Please wait until the approval
          process is complete.
        </Typography>
      </Card>
    </div>
  );
};

export default PendingPage;
