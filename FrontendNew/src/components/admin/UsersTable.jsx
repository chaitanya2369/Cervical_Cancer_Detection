import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import React, { use } from "react";
import { Checkbox } from "@material-tailwind/react";
import AddOrEditUserModal from "./AddOrEditUserModal";

const UsersTable = ({ tableData, setTableData, filter }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const deleteUser = async (userId) => {
    const resp = await axios.delete(
      `${VITE_API_URL}/admin/remove-user/${userId}`
    );
    const data = resp.data;
    if (data.success) {
      setTableData((prevData) => prevData.filter((item) => item.ID !== userId));
    } else {
      console.log("Error while deleting the admin");
    }
  };

  const updateStatus = async (user, value) => {
    if (user.Status === value) return;
    setTableData((prevData) => prevData.filter((item) => item.ID !== user.ID));
    user.Status = value;
    const resp = await axios.put(
      `${VITE_API_URL}/admin/edit-user/${user.ID}`,
      user
    );
    if (!resp.data.success) {
      console.log("Error while updating the status");
    }
  };

  const updatePermissionsUser = async (row) => {
    const resp = await axios.put(
      `${VITE_API_URL}/admin/edit-user/${row.ID}`,
      row
    );
    if (resp.data.sucess) {
      return true;
    } else false;
  };

  return (
    <div className="w-full p-3">
      <table className="w-full divide-y divide-gray-200 rounded-xl overflow-hidden border">
        <thead className="w-full bg-slate-500">
          <tr>
            <th className="px-6 py-3 text-left text-md font-medium">Name</th>
            <th className="px-6 py-3 text-left text-md font-medium">Email</th>
            <th className="px-6 py-3 text-left text-md font-medium">Status</th>
            <th className="px-6 py-3 text-left text-md font-medium">
              Predicting Permission
            </th>
            <th className="px-6 py-3 text-left text-md font-medium">
              Training Permission
            </th>
            <th className="px-6 py-3 text-left text-md font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row) => (
            <tr key={row.ID}>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.Name}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.Email}
              </td>
              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                <select
                  value={row.Status}
                  onChange={(e) => updateStatus(row, e.target.value)}
                  className={`p-1 rounded-lg ${
                    row.Status == "approved"
                      ? "bg-green-200"
                      : row.Status == "pending"
                      ? "bg-yellow-200"
                      : "bg-red-200"
                  } `}
                >
                  <option value="approved" className="bg-white">
                    Approved
                  </option>
                  <option value="pending" className="bg-white">
                    Pending
                  </option>
                  <option value="unapproved" className="bg-white">
                    Unapproved
                  </option>
                </select>
              </td>
              <td>
                <Checkbox
                  checked={row.CanPredict}
                  color="blue"
                  onChange={async (e) => {
                    const updatedRow = { ...row, CanPredict: e.target.checked };
                    const updated = await updatePermissionsUser(updatedRow);
                    if (updated) {
                      setTableData((prevData) =>
                        prevData.map((item) =>
                          item.ID === row.ID
                            ? { ...item, CanPredict: e.target.checked }
                            : item
                        )
                      );
                    } else {
                      setTableData((prevData) =>
                        prevData.map((item) =>
                          item.ID === row.ID
                            ? { ...item, CanPredict: !e.target.checked }
                            : item
                        )
                      );
                    }
                  }}
                />
              </td>
              <td>
                <Checkbox
                  checked={row.CanTrain}
                  color="blue"
                  onChange={async (e) => {
                    const updatedRow = { ...row, CanTrain: e.target.checked };
                    updatePermissionsUser(updatedRow);
                    const updated = await updatePermissionsUser(updatedRow);
                    if (updated) {
                      setTableData((prevData) =>
                        prevData.map((item) =>
                          item.ID === row.ID
                            ? { ...item, CanTrain: e.target.checked }
                            : item
                        )
                      );
                    } else {
                      setTableData((prevData) =>
                        prevData.map((item) =>
                          item.ID === row.ID
                            ? { ...item, CanTrain: !e.target.checked }
                            : item
                        )
                      );
                    }
                  }}
                />
              </td>
              <td className="flex px-6 py-3">
                <AddOrEditUserModal
                  setTableData={setTableData}
                  initialData={row}
                  filter={filter}
                >
                  <Pencil
                    size={18}
                    strokeWidth={1.5}
                    className="hover:cursor-pointer"
                  />
                </AddOrEditUserModal>

                <div className="w-px bg-gray-400 mx-1"></div>
                <Trash2
                  size={18}
                  strokeWidth={1.5}
                  className="hover:cursor-pointer"
                  onClick={() => deleteUser(row.ID)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
