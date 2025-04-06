import React, { useState } from "react";
import SearchBar from "../general.jsx/SearchBar";
import AdminsTable from "./AdminsTable";
import Pagination from "../general.jsx/Pagination";

const ViewAdmins = () => {
  const [selectedCategory, setSelectedCategory] = useState("Approved");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState("1");
  const [maxPages, setMaxPages] = useState(1);

  const handleAdminClick = (e) => {
    setSelectedCategory(e.target.textContent);
  };
  return (
    <div className="m-2">
      <h1 className="text-3xl font-semibold ml-2">Admins</h1>
      <div className="flex justify-between">
        <div className="flex bg-gray-400 rounded-lg ml-3">
          <button
            className={`
               rounded-lg
               px-4 py-3
              ${
                selectedCategory == "Approved"
                  ? "bg-slate-800 text-white"
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
               rounded-lg
               px-4 py-3
               ${
                 selectedCategory == "Unapproved"
                   ? "bg-slate-800 text-white"
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
        </div>
        <div className="flex w-full justify-end">
          <SearchBar setSearch={setSearch} />
          <button
            class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
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
          maxPages={maxPages}
        />
      </div>
    </div>
  );
};

export default ViewAdmins;
