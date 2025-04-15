import React from "react";

const Pagination = ({ currentPageNumber, setCurrentPageNumber, maxPages, itemsPerPage, setItemsPerPage, totalItems }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= maxPages) {
      setCurrentPageNumber(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPageNumber(1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPageNumber - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(maxPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <li key="start-ellipsis">
          <span className="px-3 py-2 text-gray-500">...</span>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
              currentPageNumber === i
                ? "bg-teal-500 text-white"
                : "bg-white text-gray-500"
            } rounded-lg transition-colors`}
          >
            {i}
          </button>
        </li>
      );
    }

    if (endPage < maxPages) {
      pageNumbers.push(
        <li key="end-ellipsis">
          <span className="px-3 py-2 text-gray-500">...</span>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-white shadow-sm rounded-lg">
      {/* Items per page dropdown */}
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>Showing</span>
        <select
          className="p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <span>out of {totalItems}</span>
      </div>

      {/* Pagination Controls */}
      <nav aria-label="Page navigation">
        <ul className="flex items-center space-x-1">
          <li>
            <button
              onClick={() => handlePageChange(currentPageNumber - 1)}
              disabled={currentPageNumber === 1}
              className="px-3 py-2 leading-tight border border-gray-300 rounded-lg bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
          </li>
          {renderPageNumbers()}
          <li>
            <button
              onClick={() => handlePageChange(currentPageNumber + 1)}
              disabled={currentPageNumber === maxPages}
              className="px-3 py-2 leading-tight border border-gray-300 rounded-lg bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;