import React, { useState } from "react";

const tableData2 = [
  { id: 1, name: "Liam", phoneNumber: "9876543210", status: "active" },
  { id: 2, name: "Olivia", phoneNumber: "9123456789", status: "inactive" },
  { id: 3, name: "Noah", phoneNumber: "9988776655", status: "active" },
  { id: 4, name: "Emma", phoneNumber: "9090909090", status: "inactive" },
  { id: 5, name: "Ava", phoneNumber: "9212345678", status: "active" },
  { id: 6, name: "James", phoneNumber: "9001122334", status: "inactive" },
  { id: 7, name: "Sophia", phoneNumber: "9334455667", status: "active" },
  { id: 8, name: "Elijah", phoneNumber: "9445566778", status: "inactive" },
  { id: 9, name: "Isabella", phoneNumber: "9556677889", status: "active" },
  { id: 10, name: "William", phoneNumber: "9667788990", status: "inactive" },
];

const PatientsTable = ({ tableData, setSelectedPatient }) => {
  const handlePatientClick = (id) => {
    setSelectedPatient(id);
  };
  return (
    <div className="w-full p-3">
      <table className="w-full divide-y divide-gray-200 rounded-xl overflow-hidden border">
        <thead className="w-full bg-slate-500">
          <tr>
            <th className="px-6 py-3 text-left text-md font-medium">ID</th>
            <th className="px-6 py-3 text-left text-md font-medium">Name</th>
            <th className="px-6 py-3 text-left text-md font-medium">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-md font-medium">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData2.map((row) => (
            <tr key={row.id} onClick={handlePatientClick}>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.id}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.phoneNumber}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.status}
              </td>
              <td>Edit Details</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;
