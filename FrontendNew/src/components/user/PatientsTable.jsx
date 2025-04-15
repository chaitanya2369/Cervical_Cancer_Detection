import React, { useState } from "react";
import Pagination from "../general/Pagination"
const PatientsTable = ({ tableData, setSelectedPatient }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePatientClick = (id) => {
    setSelectedPatient(id);
  };

  return (
    <div className="w-full p-3">
      <table className="w-full divide-y divide-gray-200 rounded-xl overflow-hidden border">
        <thead className="bg-teal-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-md font-medium">ID</th>
            <th className="px-6 py-3 text-left text-md font-medium">Name</th>
            <th className="px-6 py-3 text-left text-md font-medium">Phone Number</th>
            <th className="px-6 py-3 text-left text-md font-medium">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer hover:bg-teal-50"
              onClick={() => handlePatientClick(row.id)}
            >
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
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-teal-600 hover:underline">
                <button onClick={(e) => { e.stopPropagation(); alert(`Editing patient ${row.name}`); }}>
                  Edit Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 w-full flex justify-end">
        <Pagination
          currentPageNumber={currentPage}
          setCurrentPageNumber={setCurrentPage}
          maxPages={Math.ceil(tableData.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={tableData.length}
        />
      </div>
    </div>
  );
};

export default PatientsTable;