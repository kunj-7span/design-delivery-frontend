import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

const RequirementFilter = ({
  filters,
  typeOptions = [],
  statusOptions = [],
  onChange,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeCount = [filters.type, filters.status].filter(Boolean).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:border-gray-300 hover:text-gray-900"
      >
        <Filter size={16} />
        Filter
        {activeCount > 0 && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-primary">
            {activeCount}
          </span>
        )}
        <ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="filter-type"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Type
              </label>
              <select
                id="filter-type"
                value={filters.type}
                onChange={(event) => onChange("type", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-600 outline-none focus:border-primary"
              >
                <option value="">All types</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Status
              </label>
              <select
                id="filter-status"
                value={filters.status}
                onChange={(event) => onChange("status", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-600 outline-none focus:border-primary"
              >
                <option value="">All status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementFilter;
