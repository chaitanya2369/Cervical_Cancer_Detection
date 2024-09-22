import React from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "../../components/DashboardHeader";

const temp = {
  id: "BXYZ0123",
  name: "Emily snow",
  phone_numer: 9999999999,
  status: "Image not uploaded",
};

const data = [];

for (let i = 0; i < 5; i++) {
  data.push(temp);
}

console.log(data);

const TempNav = () => {
  return (
    <>
      <DashboardHeader/>
    </>
  );
};


const Table = () => {
  return (
    <table className="w-full divide-y divide-gray-200 ml-2 mr-4">
      <thead className=" w-full bg-slate-500">
        <tr>
          <th className="px-6 py-3 text-left text-md font-medium">ID</th>
          <th className="px-6 py-3 text-left text-md font-medium ">Name</th>
          <th className="px-6 py-3 text-left text-md font-medium ">
            Phone Number
          </th>
          <th className="px-6 py-3 text-left text-md font-medium">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.id}
            </td>
            <Link to={"/viewpatient"}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.name}
              </td>
            </Link>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.phone_numer}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Fields = () => {
  //not using this
  return (
    <>
      <div className="flex p-2 bg-slate-500 rounded m-2">
        <div className="flex-grow-[1]">Patient ID</div>
        <div className="flex-grow-[1]">Patient Name</div>
        <div className="flex-grow-[1]">Phone Number</div>
        <div className="flex-grow-[2]">Status</div>
      </div>
    </>
  );
};

const Patients = () => {
  return (
    <>
      <TempNav />
      <div>
        <div className="flex justify-between items-center p-4">
          <div>
            <button className="bg-blue-500 text-white mr-2 text-l p-1 rounded">
              Active Treatment
            </button>
            <button className="bg-blue-500 text-white text-l p-1 rounded">
              Inactive Treatment
            </button>
          </div>
          <div>
            <div className="relative mt-2 rounded-md shadow-sm min-w-[400px]">
              <input
                type="text"
                name="patient"
                id="patient"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search for a patient here..."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between p-4">
        <div>76 Patients</div>
        <button className="bg-blue-500 text-white p-2 rounded">
          + Add Patient
        </button>
      </div>
      {/* <Fields /> */}
      <Table />
    </>
  );
};

export default Patients;
