import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";
import { getEmployeeProjects } from "../../services/employee-services";

const ITEMS_PER_PAGE = 5;

const PROJECT_TABS = [
  { label: "Public", workMode: "public", countKey: "marketplaceCount" },
  { label: "Assigned", workMode: "assigned", countKey: "assignedCount" },
];

const UI_STATUSES = ["Backlog", "In Progress", "Completed"];
const API_STATUS_MAP = {
  "Backlog": "backlog",
  "In Progress": "in_progress",
  "Completed": "complete"
};

const formatStatusToUI = (statusStr) => {
  if (statusStr === "in_progress") return "In Progress";
  if (statusStr === "complete") return "Completed";
  return "Backlog";
};

function StatusBadge({ status }) {
  const common =
    "inline-flex max-w-full items-center rounded-full px-2 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs";
  if (status === "Backlog")
    return (
      <span className={`${common} bg-gray-100 text-gray-700`}>{status}</span>
    );
  if (status === "In Progress")
    return (
      <span className={`${common} bg-sky-100 text-sky-700`}>{status}</span>
    );
  return (
    <span className={`${common} bg-emerald-100 text-emerald-700`}>
      {status}
    </span>
  );
}

const projectColumns = [
  {
    key: "name",
    label: "Project Name",
    headerClassName: "text-center",
    cellClassName: "px-4 py-4 text-center",
    render: (value) => (
      <span className="truncate font-bold text-gray-900">{value}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    headerClassName: "text-center",
    cellClassName: "px-4 py-4 text-gray-700 whitespace-nowrap text-center",
    render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
  },
  {
    key: "clientName",
    label: "Client Name",
    headerClassName: "text-center",
    cellClassName: "px-4 py-4 text-gray-700 whitespace-nowrap text-center",
  },
  {
    key: "totalRequirements",
    label: "Total Requirements",
    headerClassName: "text-center",
    cellClassName: "px-4 py-4 text-gray-700 whitespace-nowrap text-center",
  },
  {
    key: "status",
    label: "Status",
    headerClassName: "text-center",
    cellClassName: "px-4 py-4 whitespace-nowrap text-center",
    render: (value) => <StatusBadge status={formatStatusToUI(value)} />,
  },
];

function formatShowing(from, to, total) {
  if (total === 0) return "Showing 0 results";
  return `Showing ${from} to ${to} of ${total} results`;
}

export default function EmployeeProjects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("public");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const uniqueStatuses = UI_STATUSES;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const apiStatuses = selectedStatuses.map(s => API_STATUS_MAP[s]).join(',');

        const response = await getEmployeeProjects({
          tab: activeTab,
          page,
          limit: ITEMS_PER_PAGE,
          search: query,
          status: apiStatuses || undefined
        });

        if (response && response.data) {
          setProjects(response.data);
          setMeta(response.meta || {});
        }
      } catch (err) {
        console.error("Failed to fetch employee projects", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, page, query, selectedStatuses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, query, selectedStatuses]);

  const totalPages = meta.totalPages || 1;
  const safePage = Math.min(page, totalPages);

  const totalRecords = meta.filteredProjects !== undefined ? meta.filteredProjects : 0;
  const fromIdx = totalRecords === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE;
  const toIdxExclusive = Math.min(fromIdx + ITEMS_PER_PAGE, totalRecords);

  const showingText = formatShowing(
    totalRecords === 0 ? 0 : fromIdx + 1,
    totalRecords === 0 ? 0 : toIdxExclusive,
    totalRecords,
  );

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-5 xl:p-6">
      <main>
        <div className="mx-auto w-full max-w-7xl">
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex gap-3 overflow-x-auto border-b border-gray-100 px-3 pt-4 sm:gap-6 sm:px-5 lg:px-6">
              {PROJECT_TABS.map((tab) => (
                <button
                  key={tab.workMode}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.workMode);
                    setShowFilters(false);
                  }}
                  className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors sm:text-[15px] ${activeTab === tab.workMode
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label} {meta[tab.countKey] !== undefined ? `(${meta[tab.countKey]})` : ""}
                  {activeTab === tab.workMode && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-b border-gray-100 p-3 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <div className="w-full lg:max-w-md">
                <label className="sr-only" htmlFor="project-search">
                  Search projects
                </label>
                <input
                  id="project-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder={`Search ${activeTab} projects...`}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {selectedStatuses.length > 0 && (
                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                      {selectedStatuses.length}
                    </span>
                  )}
                </button>

                {showFilters && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-56">
                    <div className="border-b border-gray-100 p-4">
                      <p className="text-xs font-semibold uppercase text-gray-600">
                        Filter by Status
                      </p>
                    </div>
                    <div className="p-4 space-y-3">
                      {uniqueStatuses.map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStatuses([
                                  ...selectedStatuses,
                                  status,
                                ]);
                              } else {
                                setSelectedStatuses(
                                  selectedStatuses.filter(
                                    (s) => s !== status,
                                  ),
                                );
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 border-t border-gray-100 p-4">
                      <button
                        type="button"
                        onClick={() => setSelectedStatuses([])}
                        className="flex-1 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 py-2"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="flex-1 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/80 py-2"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-3 py-3 text-xs text-gray-500 sm:px-5 sm:text-sm lg:px-6">
              {showingText}
            </div>

            <Table
              data={projects}
              columns={projectColumns}
              onRowClick={(row) => navigate(`/employee/employee-projects/employee-projects-requirement/${row.id}`)}
              renderActions={false}
              rowClassName={() => "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 cursor-pointer bg-white"}
              tableClassName="w-full min-w-[760px] text-sm"
              containerClassName="hidden overflow-x-auto lg:block"
            />

            <div className="grid gap-3 p-3 sm:p-5 lg:hidden lg:px-6 md:grid-cols-2">
              {projects.length > 0 ? (
                projects.map((row) => (
                  <article
                    key={`${row.id}-mobile`}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
                    onClick={() => navigate(`/employee/employee-projects/employee-projects-requirement/${row.id}`)}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-col gap-1">
                          <h3 className="wrap-break-word text-sm font-bold text-gray-900 sm:text-base">
                            {row.name}
                          </h3>
                          <p className="wrap-break-word text-xs text-gray-500">
                            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                      <div className="self-start">
                        <StatusBadge status={formatStatusToUI(row.status)} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 sm:gap-3">
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <span className="text-xs font-medium text-gray-500">
                          Client
                        </span>
                        <p className="mt-1 wrap-break-word font-semibold text-gray-800">
                          {row.clientName}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <span className="text-xs font-medium text-gray-500">
                          Total Requirements
                        </span>
                        <p className="mt-1 font-semibold text-gray-800">
                          {row.totalRequirements}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2 sm:col-span-2">
                        <span className="text-xs font-medium text-gray-500">
                          Work Mode
                        </span>
                        <p className="mt-1 font-semibold capitalize text-gray-800">
                          {row.workMode}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No {activeTab} projects found.
                </div>
              )}
            </div>

            {projects.length === 0 && (
              <div className="hidden p-8 text-center text-sm text-gray-500 lg:block">
                No {activeTab} projects found.
              </div>
            )}

            {totalPages > 1 && (
              <div className="overflow-x-auto border-t border-gray-100 p-2 sm:p-4 lg:px-6">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    if (p < 1 || p > totalPages) return;
                    setPage(p);
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
