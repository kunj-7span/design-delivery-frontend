import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";

const PROJECT_ROWS = [
  {
    workMode: "marketplace",
    projectName: "Website Redesign",
    phase: "Phase 2: Mobile View",
    clientName: "Acme Corp",
    totalRequirements: 48,
    status: "Backlog",
  },
  {
    workMode: "assigned",
    projectName: "Q4 Marketing",
    phase: "Campaign Assets",
    clientName: "Globex",
    totalRequirements: 125,
    status: "In Progress",
  },
  {
    workMode: "marketplace",
    projectName: "Social Campaign",
    phase: "Instagram & LinkedIn",
    clientName: "Soylent Corp",
    totalRequirements: 14,
    status: "In Progress",
  },
  {
    workMode: "assigned",
    projectName: "Logo Refresh",
    phase: "Brand Identity",
    clientName: "Umbrella Inc",
    totalRequirements: 8,
    status: "Completed",
  },
  {
    workMode: "marketplace",
    projectName: "Product Demo Video",
    phase: "Q4 Launch",
    clientName: "Cyberdyne",
    totalRequirements: 3,
    status: "In Progress",
  },
  {
    workMode: "assigned",
    projectName: "Landing Page Revamp",
    phase: "Conversion Copy",
    clientName: "Wayne Enterprises",
    totalRequirements: 22,
    status: "Backlog",
  },
  {
    workMode: "marketplace",
    projectName: "E-commerce Update",
    phase: "Checkout Optimization",
    clientName: "Stark Industries",
    totalRequirements: 67,
    status: "In Progress",
  },
  {
    workMode: "assigned",
    projectName: "Mobile App UI Refresh",
    phase: "Design System",
    clientName: "Gordons",
    totalRequirements: 39,
    status: "Backlog",
  },
  {
    workMode: "marketplace",
    projectName: "Brand Guidelines Pack",
    phase: "Typography + Colors",
    clientName: "Initech",
    totalRequirements: 17,
    status: "Completed",
  },
  {
    workMode: "assigned",
    projectName: "Press Kit",
    phase: "Media Assets",
    clientName: "Hooli",
    totalRequirements: 9,
    status: "In Progress",
  },
  {
    workMode: "marketplace",
    projectName: "Email Campaign Setup",
    phase: "Templates",
    clientName: "Monsters, Inc.",
    totalRequirements: 11,
    status: "Backlog",
  },
  {
    workMode: "assigned",
    projectName: "Dashboard Icons",
    phase: "Icon Set v2",
    clientName: "Vandelay",
    totalRequirements: 6,
    status: "Completed",
  },
];

const PROJECT_TABS = [
  { label: "Marketplace", workMode: "marketplace" },
  { label: "Assigned", workMode: "assigned" },
];

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
    key: "projectName",
    label: "Project Name",
    cellClassName: "px-4 py-4 xl:w-[40%]",
    render: (value, item) => (
      <div className="flex min-w-0 flex-col gap-1 xl:flex-row xl:items-center xl:gap-2">
        <span className="truncate font-bold text-gray-900">{value}</span>
        <span className="truncate text-xs text-gray-500 xl:whitespace-nowrap">
          {item.phase}
        </span>
      </div>
    ),
  },
  {
    key: "clientName",
    label: "Client Name",
    cellClassName: "px-4 py-4 text-gray-700 whitespace-nowrap",
  },
  {
    key: "totalRequirements",
    label: "Total Requirements",
    cellClassName: "px-4 py-4 text-gray-700 whitespace-nowrap",
  },
  {
    key: "status",
    label: "Status",
    cellClassName: "px-4 py-4 whitespace-nowrap",
    render: (value) => <StatusBadge status={value} />,
  },
];

function formatShowing(from, to, total) {
  if (total === 0) return "Showing 0 results";
  return `Showing ${from} to ${to} of ${total} results`;
}

export default function EmployeeProjects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const pageSize = 5;

  const uniqueStatuses = [...new Set(PROJECT_ROWS.map((r) => r.status))];

  const filteredRows = useMemo(() => {
    let results = PROJECT_ROWS.filter((row) => row.workMode === activeTab);

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
  }, [activeTab, query, selectedStatuses]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeTab, query, selectedStatuses]);

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
    <div className="min-h-screen p-2 sm:p-4 md:p-5 xl:p-6">
      <main>
        <div className="mx-auto w-full max-w-7xl">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex gap-3 overflow-x-auto border-b border-gray-100 px-3 pt-4 sm:gap-6 sm:px-5 lg:px-6">
                {PROJECT_TABS.map((tab) => (
                  <button
                    key={tab.workMode}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.workMode);
                      setShowFilters(false);
                    }}
                    className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors sm:text-[15px] ${
                      activeTab === tab.workMode
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
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
                    Filter{" "}
                    {selectedStatuses.length > 0 &&
                      `(${selectedStatuses.length})`}
                  </button>


                  {showFilters && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-56">
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

              <div className="px-3 py-3 text-xs text-gray-500 sm:px-5 sm:text-sm lg:px-6">
                {showingText}
              </div>

              <Table
                data={pageRows}
                columns={projectColumns}
                onRowClick={() => navigate("/employee/employee-projects/employee-projects-requirement")}
                renderActions={false}
                rowClassName={() => "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 cursor-pointer bg-white"}
                tableClassName="w-full min-w-[760px] text-left text-sm xl:min-w-full"
                containerClassName="hidden overflow-x-auto lg:block"
              />

              <div className="grid gap-3 p-3 sm:p-5 lg:hidden lg:px-6 md:grid-cols-2">
                {pageRows.length > 0 ? (
                  pageRows.map((row) => (
                    <article
                      key={`${row.projectName}-${row.clientName}-${row.totalRequirements}-mobile`}
                      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
                      onClick={() => navigate("/employee/employee-projects/employee-projects-requirement")}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-col gap-1">
                            <h3 className="break-words text-sm font-bold text-gray-900 sm:text-base">
                              {row.projectName}
                            </h3>
                            <p className="break-words text-xs text-gray-500">
                              {row.phase}
                            </p>
                          </div>
                        </div>
                        <div className="self-start">
                          <StatusBadge status={row.status} />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 sm:gap-3">
                        <div className="rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-xs font-medium text-gray-500">
                            Client
                          </span>
                          <p className="mt-1 break-words font-semibold text-gray-800">
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

              {filteredRows.length === 0 && (
                <div className="hidden p-8 text-center text-sm text-gray-500 md:block">
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
