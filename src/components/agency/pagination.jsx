import React from "react";
import { MoveLeft , MoveRight  } from "lucide-react";

const Pagination = ({ currentPage, totalPages=13, onPageChange }) => {
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-3 my-3">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-500 cursor-pointer"
      >
        <MoveLeft  size={18} />
      </button>

      {/* Pages */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3.5 py-1.5 rounded-lg font-medium cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-500 cursor-pointer"
      >
        <MoveRight  size={18} />
      </button>
    </div>
  );
};

export default Pagination;