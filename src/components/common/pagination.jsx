import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pagination = ({ currentPage, totalPages = 13, onPageChange }) => {
  return (
    <div className="flex items-center justify-between gap-3 my-3 border border-gray-200 rounded-lg px-4 py-2 bg-white">
      {/* Left: Page info */}
      <div className="text-gray-700 text-sm min-w-27.5">
        Page {currentPage} of {totalPages}
      </div>

      {/* Right: Prev/Next */}
      <div className="flex items-center gap-2 min-w-30 justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          <span className="flex items-center gap-1">
            <ChevronLeft size={16} />
          </span>
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          <span className="flex items-center gap-1">
            <ChevronRight size={16} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
