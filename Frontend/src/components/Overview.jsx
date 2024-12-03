import React from "react";

const Overview = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Overview</h1>
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold text-gray-600">Total Users</h2>
        <p className="text-2xl font-bold text-blue-600">150</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold text-gray-600">Approved Users</h2>
        <p className="text-2xl font-bold text-green-600">120</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold text-gray-600">Pending Approvals</h2>
        <p className="text-2xl font-bold text-red-600">30</p>
      </div>
    </div>
  </div>
);

export default Overview;
