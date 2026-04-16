import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  X,
  Filter,
} from "lucide-react";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";

const PROJECT_ROWS = [
  {
    projectName: "Website Redesign",
    phase: "Phase 2: Mobile View",
    clientName: "Acme Corp",
    totalRequirements: 48,
    status: "Backlog",
  },
  {
    projectName: "Q4 Marketing",
    phase: "Campaign Assets",
    clientName: "Globex",
    totalRequirements: 125,
    status: "In Progress",
  },
  {
    projectName: "Social Campaign",
    phase: "Instagram & LinkedIn",
    clientName: "Soylent Corp",
    totalRequirements: 14,
    status: "In Progress",
  },
  {
    projectName: "Logo Refresh",
    phase: "Brand Identity",
    clientName: "Umbrella Inc",
    totalRequirements: 8,
    status: "Completed",
  },
  {
    projectName: "Product Demo Video",
    phase: "Q4 Launch",
    clientName: "Cyberdyne",
    totalRequirements: 3,
    status: "In Progress",
  },
  {
    projectName: "Landing Page Revamp",
    phase: "Conversion Copy",
    clientName: "Wayne Enterprises",
    totalRequirements: 22,
    status: "Backlog",
  },
  {
    projectName: "E-commerce Update",
    phase: "Checkout Optimization",
    clientName: "Stark Industries",
    totalRequirements: 67,
    status: "In Progress",
  },
  {
    projectName: "Mobile App UI Refresh",
    phase: "Design System",
    clientName: "Gordons",
    totalRequirements: 39,
    status: "Backlog",
  },
  {
    projectName: "Brand Guidelines Pack",
    phase: "Typography + Colors",
    clientName: "Initech",
    totalRequirements: 17,
    status: "Completed",
  },
  {
    projectName: "Press Kit",
    phase: "Media Assets",
    clientName: "Hooli",
    totalRequirements: 9,
    status: "In Progress",
  },
  {
    projectName: "Email Campaign Setup",
    phase: "Templates",
    clientName: "Monsters, Inc.",
    totalRequirements: 11,
    status: "Backlog",
  },
  {
    projectName: "Dashboard Icons",
    phase: "Icon Set v2",
    clientName: "Vandelay",
    totalRequirements: 6,
    status: "Completed",
  },
];

function StatusBadge({ status }) {
  const common =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
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
    key: "projectName",
    label: "Project Name",
    cellClassName: "px-4 py-4",
    render: (value, item) => (
      <>
        <div className="font-bold text-gray-900">{value}</div>
        <div className="mt-1 text-xs text-gray-500">{item.phase}</div>
      </>
    ),
  },
  {
    key: "clientName",
    label: "Client Name",
    cellClassName: "px-4 py-4 text-gray-700",
  },
  {
    key: "totalRequirements",
    label: "total Requirements",
    cellClassName: "px-4 py-4 text-gray-700",
  },
  {
    key: "status",
    label: "Status",
    cellClassName: "px-4 py-4",
    render: (value) => <StatusBadge status={value} />,
  },
];

function formatShowing(from, to, total) {
  if (total === 0) return "Showing 0 results";
  return `Showing ${from} to ${to} of ${total} results`;
}

export default function EmployeeProjects() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const pageSize = 5;

  const uniqueStatuses = [...new Set(PROJECT_ROWS.map((r) => r.status))];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      mq.removeEventListener("change", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredRows = useMemo(() => {
    let results = PROJECT_ROWS;

    if (selectedStatuses.length > 0) {
      results = results.filter((r) => selectedStatuses.includes(r.status));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((r) => {
        return (
          r.projectName.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.phase.toLowerCase().includes(q) ||
          String(r.totalRequirements).includes(q) ||
          r.status.toLowerCase().includes(q)
        );
      });
    }
    return results;
  }, [query, selectedStatuses]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [query, selectedStatuses]);

  const safePage = Math.min(page, totalPages);
  const fromIdx = (safePage - 1) * pageSize;
  const toIdxExclusive = Math.min(fromIdx + pageSize, filteredRows.length);
  const pageRows = filteredRows.slice(fromIdx, toIdxExclusive);

  const showingText = formatShowing(
    filteredRows.length === 0 ? 0 : fromIdx + 1,
    filteredRows.length === 0 ? 0 : toIdxExclusive,
    filteredRows.length,
  );

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <main>
        <div className="mx-auto max-w-7xl">
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto ">
                  <label className="sr-only" htmlFor="project-search">
                    Search projects
                  </label>
                  <input
                    id="project-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search projects..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:min-w-65 lg:min-w-[320px]"
                  />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    Filter{" "}
                    {selectedStatuses.length > 0 &&
                      `(${selectedStatuses.length})`}
                  </button>


                  {showFilters && (
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
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
                          className="flex-1 rounded text-sm font-semibold text-gray-700 hover:bg-gray-100 py-2"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowFilters(false)}
                          className="flex-1 rounded bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-600 py-2"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Table
                data={pageRows}
                columns={projectColumns}
                onRowClick={() => navigate("/employee/employee-projects/employee-projects-requirement")}
                renderActions={false}
                rowClassName={() => "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 cursor-pointer bg-white"}
                tableClassName="w-full min-w-96 text-left text-sm"
                containerClassName="hidden overflow-x-auto md:block"
              />

              <div className="space-y-3 p-4 md:hidden">
                {pageRows.map((row) => (
                  <article
                    key={`${row.projectName}-${row.clientName}-${row.totalRequirements}-mobile`}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate("/employee/employee-projects/employee-projects-requirement")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-900">
                          {row.projectName}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {row.phase}
                        </p>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>

                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-gray-500">
                          Client
                        </span>
                        <span className="font-semibold text-gray-800">
                          {row.clientName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-gray-500">
                          totalRequirements
                        </span>
                        <span className="font-semibold text-gray-800">
                          {row.totalRequirements}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-gray-500">
                          Due
                        </span>
                        <span className="font-semibold text-gray-800">
                          {row.dueDate}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="border-t border-gray-100 p-4">
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
