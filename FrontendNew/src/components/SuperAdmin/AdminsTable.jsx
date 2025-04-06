import React from "react";

const tableData2 = [
  {
    id: 1,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 2,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 3,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 4,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 5,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 6,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 7,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 8,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 9,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
  {
    id: 10,
    name: "Sanmai",
    eamil: "ysreddy377@gmail.com",
    organization: "YSR",
    status: "approved",
  },
];

const AdminsTable = ({ tableData }) => {
  return (
    <div className="w-full p-3">
      <table className="w-full divide-y divide-gray-200 rounded-xl overflow-hidden border">
        <thead className="w-full bg-slate-500">
          <tr>
            <th className="px-6 py-3 text-left text-md font-medium">Name</th>
            <th className="px-6 py-3 text-left text-md font-medium">Email</th>
            <th className="px-6 py-3 text-left text-md font-medium">
              Organization
            </th>
            <th className="px-6 py-3 text-left text-md font-medium">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData2.map((row) => (
            <tr key={row.id}>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.eamil}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.organization}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.approve}
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsTable;
