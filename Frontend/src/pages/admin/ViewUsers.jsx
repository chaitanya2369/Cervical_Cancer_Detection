import React, { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import UserModal from "../../components/UserModal";

const temp = {
  id: "BXYZ0123",
  name: "Emily snow",
  email: "ysreddy377@gmail.com",
  phone_numer: 9999999999,
  permission_pred: 1,
  permission_train: 0,
};

const data = [];

for (let i = 0; i < 9; i++) {
  data.push(temp);
}

console.log(data);

const Table = () => {
  return (
    <div className="w-full p-3">
      <table className="w-full divide-y divide-gray-200 ">
        <thead className=" w-full bg-slate-500">
          <tr>
            <th className="px-6 py-3 text-left text-md font-medium">User ID</th>
            <th className="px-6 py-3 text-left text-md font-medium ">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-md font-medium ">
              Email ID
            </th>
            <th className="px-6 py-3 text-left text-md font-medium ">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-md font-medium ">
              Permission for Prediction
            </th>
            <th className="px-6 py-3 text-left text-md font-medium ">
              Permission for Training
            </th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.id}
              </td>
              <Link to={"/viewpatient"}>
                <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
              </Link>
              <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.email}
              </td>
              <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.phone_numer}
              </td>
              <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.permission_pred ? (
                  <div>
                    <input
                      checked
                      id="checked-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    ></input>

                    <label htmlFor="default-checkbox" className="ms-2 text-sm ">
                      Granted
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      defaultValue
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm">
                      Not Granted
                    </label>
                  </div>
                )}
              </td>
              <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.permission_train ? (
                  <div>
                    <input
                      checked
                      id="checked-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    ></input>

                    <label htmlFor="default-checkbox" className="ms-2 text-sm">
                      Granted
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      defaultValue
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm ">
                      Not Granted
                    </label>
                  </div>
                )}
              </td>
              <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                <button className="bg-sky-600 p-2 rounded text-white">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                    Edit Details
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViewUsers = () => {
  const [isVisible, setVisible] = useState(false);
  const BottomNav = () => {
    return (
      <div className="flex justify-center mt-2">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-2.5 h-2.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between m-2">
        <div className="relative mt-2 rounded-md shadow-sm min-w-[500px]">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            name="patient"
            id="patient"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ml-1"
            placeholder="Search for a user here..."
          />
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded hover: cursor-pointer"
          onClick={() => {
            setVisible(true);
            // console.log(isVisible);
          }}
        >
          <div className="flex">
            <PlusIcon className="h-6 w-6" />
            Add User
          </div>
        </button>
      </div>
      <Table />
      <BottomNav />
      {isVisible && <UserModal setVisible={setVisible} />}
    </div>
  );
};

export default ViewUsers;
