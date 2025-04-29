import React, { useEffect, useState } from "react";
import SearchBar from "../general/SearchBar";
import AdminsTable from "./AdminsTable";
import Pagination from "../general/Pagination";
import axios from "axios";
import AddAdminModal from "../admin/AddAdminModal";

const ViewAdmins = () => {
  const SERVER_URL = import.meta.env.VITE_API_URL;
  const [selectedCategory, setSelectedCategory] = useState("Approved");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState("1");
  const [maxPages, setMaxPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchAdmins = async () => {
      const status = selectedCategory.toLowerCase();
      const resp = await axios.get(
        `${SERVER_URL}/super-admin/admins?status=${status}&page=${pageNumber}&size=${itemsPerPage}&search=${search}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = resp.data;
      if (data.success) {
        console.log(data);
        if (data.admins == null) {
          setTableData([]);
          setMaxPages(1);
          setTotalItems(0);
        } else {
          setTableData(data.admins);
          setTotalItems(data.count);
          setMaxPages(Math.ceil(data.count / itemsPerPage));
        }
        console.log(data.admins);
      }
    };
    fetchAdmins();
  }, [selectedCategory, search, pageNumber, itemsPerPage]);

  const handleAdminClick = (e) => {
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
          <AddAdminModal />
        </div>
      </div>
      <AdminsTable tableData={tableData} setTableData={setTableData} />
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

export default ViewAdmins;
