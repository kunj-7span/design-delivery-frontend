import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../../components/common/pagination";
import { getProjects } from "../../services/agency-services";

const ITEMS_PER_PAGE = 5;

const tabs = [
  { label: "All Projects", workMode: null, status: null },
  { label: "Public", workMode: "public", status: null },
  { label: "Assigned", workMode: "assigned", status: null },
  { label: "Completed", workMode: null, status: "complete" },
];

const statusStyles = {
  backlog: "bg-gray-100 text-gray-500",
  in_progress: "bg-indigo-50 text-indigo-600",
  completed: "bg-emerald-50 text-emerald-600",
  on_hold: "bg-amber-50 text-amber-600",
};

const progressColor = {
  backlog: "bg-gray-300",
  in_progress: "bg-indigo-500",
  completed: "bg-emerald-500",
  on_hold: "bg-amber-500",
};

const AgencyProjectsList = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { workMode, status } = tabs[activeTab];
      const response = await getProjects({
        workMode,
        status,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setProjects(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching projects:", error);
      //toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // Client-side search filter on current page data
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-heading">Projects</h2>
        <Link
          to="/agency/agency-projects/create-project"
          className="bg-primary hover:bg-hover-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md shadow-indigo-100 text-sm transition-colors"
        >
          <Plus size={18} />
          Create New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(index)}
            className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${activeTab === index
              ? "text-gray-900"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-1 min-w-60">
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search projects"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Employees</th>
                    <th className="px-6 py-4">Assets</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800 text-sm">
                        {p.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[p.status] ||
                            "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {formatStatus(p.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.employeeCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.assetCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 w-32">
                          <span className="text-xs font-bold text-gray-600">
                            {p.progress}%
                          </span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${progressColor[p.status] || "bg-gray-300"
                                }`}
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/agency/agency-projects/view-project-detail/${p.id}`}
                          className="bg-primary hover:bg-hover-primary cursor-pointer text-white text-[10px] font-bold py-2 px-4 rounded-xl uppercase shadow-md shadow-indigo-100 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredProjects.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {p.name}
                      </h3>
                      <span className="text-xs text-gray-400 capitalize">
                        {p.workMode}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusStyles[p.status] || "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {formatStatus(p.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-600">
                      {p.progress}%
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${progressColor[p.status] || "bg-gray-300"
                          }`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {p.employeeCount} employees · {p.assetCount} assets
                    </span>
                    <span>{formatDate(p.createdAt)}</span>
                  </div>

                  <Link
                    to={`/agency/agency-projects/view-project/${p.id}`}
                    className="block w-full bg-primary hover:bg-hover-primary text-center text-white text-xs font-bold py-2 rounded-xl uppercase shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 flex items-center justify-center">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
};

export default AgencyProjectsList;
