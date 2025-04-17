import React, { useEffect, useState } from "react";
import SearchBar from "../general/SearchBar";
import AdminsTable from "./AdminsTable";
import Pagination from "../general/Pagination";
import axios from "axios";

const ViewAdmins = () => {
  const SERVER_URL = import.meta.env.VITE_API_URL;
  const [selectedCategory, setSelectedCategory] = useState("Approved");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState("1");
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchAdmins = async () => {
      const status = selectedCategory.toLowerCase();
      const resp = await axios.get(
        `${SERVER_URL}/super-admin/admins?status=${status}&page=${pageNumber}&size=${pageSize}&search=${search}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = resp.data;
      if (data.success) {
        console.log(data);
        if (data.admins == null) {
          setTableData([]);
        } else setTableData(data.admins);
        console.log(data.admins);
      }
    };
    fetchAdmins();
  }, [selectedCategory, search, pageNumber, pageSize]);

  const handleAdminClick = (e) => {
    setSelectedCategory(e.target.textContent);
  };
  return (
    <div className="m-2">
      <h1 className="text-3xl font-semibold ml-2">Admins</h1>
      <div className="flex justify-between">
        <div className="flex bg-themeDarkGray rounded-xl ml-3">
          <button
            className={`
               rounded-xl
               px-4 py-2
              ${
                selectedCategory == "Approved"
                  ? "bg-themeBlue text-white"
                  : "bg-transparent"
              }
              `}
            type="button"
            onClick={(e) => {
              handleAdminClick(e);
            }}
          >
            Approved
          </button>
          <button
            className={`
               rounded-xl
               px-4 py-2
               ${
                 selectedCategory == "Unapproved"
                   ? "bg-themeBlue text-white"
                   : "bg-transparent"
               }
              `}
            type="button"
            onClick={(e) => {
              handleAdminClick(e);
            }}
          >
            Unapproved
          </button>
          <button
            className={`
               rounded-xl
               px-4 py-2
              ${
                selectedCategory == "Pending"
                  ? "bg-themeBlue text-white"
                  : "bg-transparent"
              }
              `}
            type="button"
            onClick={(e) => {
              handleAdminClick(e);
            }}
          >
            Pending
          </button>
        </div>
        <div className="flex w-full justify-end">
          <SearchBar setSearch={setSearch} />
          <button
            class="rounded-xl bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
          >
            + Add Admin
          </button>
        </div>
      </div>
      <AdminsTable tableData={tableData} />
      <div className="w-full flex justify-end">
        <Pagination
          currentPageNumber={pageNumber}
          setCurrentPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          maxPages={maxPages}
        />
      </div>
    </div>
  );
};

export default ViewAdmins;
