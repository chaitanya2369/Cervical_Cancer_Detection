import React, { useEffect, useState } from "react";
import SearchBar from "../general/SearchBar";
import UsersTable from "./UsersTable";
import Pagination from "../general/Pagination";
import axios from "axios";

const ViewUsers = () => {
  const SERVER_URL = import.meta.env.VITE_API_URL;
  const [selectedCategory, setSelectedCategory] = useState("Approved");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState("1");
  const [maxPages, setMaxPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hospital, setHospital] = useState("KIMS");

  useEffect(() => {
    const fetchUsers = async () => {
      const status = selectedCategory.toLowerCase();
      const resp = await axios.get(
        `${SERVER_URL}/admin/users?status=${status}&page=${pageNumber}&size=${itemsPerPage}&search=${search}&hospital=${hospital}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = resp.data;
      if (data.success) {
        console.log(data);
        if (data.users == null) {
          setTableData([]);
          setMaxPages(1);
          setTotalItems(0);
        } else {
          setTableData(data.users);
          setTotalItems(data.count);
          setMaxPages(Math.ceil(data.count / itemsPerPage));
        }
      }
    };
    fetchUsers();
  }, [selectedCategory, search, pageNumber, itemsPerPage]);

  const handleUserClick = (e) => {
    setSelectedCategory(e.target.textContent);
  };
  return (
    <div className="m-2">
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
              handleUserClick(e);
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
              handleUserClick(e);
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
              handleUserClick(e);
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
      <UsersTable tableData={tableData} setTableData={setTableData} />
      <div className="w-full flex justify-end">
        <Pagination
          currentPageNumber={pageNumber}
          setCurrentPageNumber={setPageNumber}
          maxPages={maxPages}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

export default ViewUsers;
