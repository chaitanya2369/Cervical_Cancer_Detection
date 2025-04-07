import React, { useState } from "react";
import SearchBar from "../general/SearchBar";
import PatientsTable from "./PatientsTable";
import Pagination from "../general/Pagination";
import Patient from "./Patient";

const ViewPatients = () => {
  const [selectedCategory, setSelectedCategory] = useState("Active Treatment");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState("1");
  const [maxPages, setMaxPages] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState("");

  const handleAdminClick = (e) => {
    setSelectedCategory(e.target.textContent);
  };
  return (
    <div>
      {selectedPatient == "" ? (
        <div className="m-2">
          <h1 className="text-3xl font-semibold ml-2">Patients</h1>
          <div className="flex justify-between">
            <div className="flex bg-gray-400 rounded-lg ml-3">
              <button
                className={`
               rounded-lg
               px-4 py-3
               whitespace-nowrap
              ${
                selectedCategory == "Active Treatment"
                  ? "bg-slate-800 text-white"
                  : "bg-transparent"
              }
              `}
                type="button"
                onClick={(e) => {
                  handleAdminClick(e);
                }}
              >
                Active Treatment
              </button>
              <button
                className={`
               rounded-lg
               px-4 py-3
               whitespace-nowrap
               ${
                 selectedCategory == "Inactive Treatment"
                   ? "bg-slate-800 text-white"
                   : "bg-transparent"
               }
              `}
                type="button"
                onClick={(e) => {
                  handleAdminClick(e);
                }}
              >
                Inactive Treatment
              </button>
            </div>
            <div className="flex w-full justify-end">
              <SearchBar setSearch={setSearch} />
              <button
                class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
              >
                + Add Patient
              </button>
            </div>
          </div>
          <PatientsTable
            tableData={tableData}
            setSelectedPatient={setSelectedPatient}
          />
          <div className="w-full flex justify-end">
            <Pagination
              currentPageNumber={pageNumber}
              setCurrentPageNumber={setPageNumber}
              maxPages={maxPages}
            />
          </div>
        </div>
      ) : (
        <Patient id={selectedPatient} />
      )}
    </div>
  );
};

export default ViewPatients;
