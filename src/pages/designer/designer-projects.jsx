import { useEffect, useMemo, useState } from "react";
import logo from "../../assets/DDLogoFull.png";
import {
  FolderOpen,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  X,
  Filter,
} from "lucide-react";

const PROJECT_ROWS = [
  {
    projectName: "Website Redesign",
    phase: "Phase 2: Mobile View",
    clientName: "Acme Corp",
    totalRequirements: 48,
    dueDate: "Oct 24, 2023",
    status: "Backlog",
  },
  {
    projectName: "Q4 Marketing",
    phase: "Campaign Assets",
    clientName: "Globex",
    totalRequirements: 125,
    dueDate: "Oct 28, 2023",
    status: "In Progress",
  },
  {
    projectName: "Social Campaign",
    phase: "Instagram & LinkedIn",
    clientName: "Soylent Corp",
    totalRequirements: 14,
    dueDate: "Oct 30, 2023",
    status: "In Progress",
  },
  {
    projectName: "Logo Refresh",
    phase: "Brand Identity",
    clientName: "Umbrella Inc",
    totalRequirements: 8,
    dueDate: "Nov 02, 2023",
    status: "Completed",
  },
  {
    projectName: "Product Demo Video",
    phase: "Q4 Launch",
    clientName: "Cyberdyne",
    totalRequirements: 3,
    dueDate: "Nov 05, 2023",
    status: "In Progress",
  },
  {
    projectName: "Landing Page Revamp",
    phase: "Conversion Copy",
    clientName: "Wayne Enterprises",
    totalRequirements: 22,
    dueDate: "Nov 10, 2023",
    status: "Backlog",
  },
  {
    projectName: "E-commerce Update",
    phase: "Checkout Optimization",
    clientName: "Stark Industries",
    totalRequirements: 67,
    dueDate: "Nov 12, 2023",
    status: "In Progress",
  },
  {
    projectName: "Mobile App UI Refresh",
    phase: "Design System",
    clientName: "Gordons",
    totalRequirements: 39,
    dueDate: "Nov 15, 2023",
    status: "Backlog",
  },
  {
    projectName: "Brand Guidelines Pack",
    phase: "Typography + Colors",
    clientName: "Initech",
    totalRequirements: 17,
    dueDate: "Nov 18, 2023",
    status: "Completed",
  },
  {
    projectName: "Press Kit",
    phase: "Media Assets",
    clientName: "Hooli",
    totalRequirements: 9,
    dueDate: "Nov 20, 2023",
    status: "In Progress",
  },
  {
    projectName: "Email Campaign Setup",
    phase: "Templates",
    clientName: "Monsters, Inc.",
    totalRequirements: 11,
    dueDate: "Nov 22, 2023",
    status: "Backlog",
  },
  {
    projectName: "Dashboard Icons",
    phase: "Icon Set v2",
    clientName: "Vandelay",
    totalRequirements: 6,
    dueDate: "Nov 25, 2023",
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

function formatShowing(from, to, total) {
  if (total === 0) return "Showing 0 results";
  return `Showing ${from} to ${to} of ${total} results`;
}

export default function DesignerProjects() {
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
    <div className="min-h-screen bg-white text-gray-900">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-gray-200 bg-gray-100 transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-3 ">
          <img src={logo} className="w-30 sm:w-32 md:w-34 lg:w-36" alt="" />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
          <a
            href="/designer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200/80"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutGrid className="h-5 w-5 shrink-0" aria-hidden />
            Dashboard
          </a>

          <a
            href="/designer/projects"
            className="flex items-center gap-3 rounded-lg bg-sky-100 px-3 py-2.5 text-sm font-semibold text-sky-700"
            aria-current="page"
            onClick={() => setSidebarOpen(false)}
          >
            <FolderOpen className="h-5 w-5 shrink-0" aria-hidden />
            Projects
          </a>
        </nav>

        <div className="border-t border-gray-200 px-3 py-4">
          <a
            href="#settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/80"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="h-5 w-5 shrink-0" aria-hidden />
            Settings
          </a>

          <button
            type="button"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-200/80"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </button>

            <div className="min-w-0">
              {/* <p className="truncate text-sm font-medium text-gray-500">
                Dashboard / <span className="text-gray-900">Projects</span>
              </p> */}
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                Projects
              </h1>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="hidden text-sm font-semibold text-gray-800 sm:inline">
                Kishan
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary to-purple-700 text-xs font-bold text-white"
                aria-hidden
              >
                K
              </span>
            </button>
          </div>
        </header>


        <main className="flex min-h-screen bg-gray p-5">Comming Soon</main>
{/* 
        <main className="flex-1 bg-gray-50/80 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
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

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-96 text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Client Name
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        total Requirements
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr
                        key={`${row.projectName}-${row.clientName}-${row.totalRequirements}`}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                      >
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-900">
                            {row.projectName}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {row.phase}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.clientName}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.totalRequirements}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.dueDate}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {pageRows.map((row) => (
                  <article
                    key={`${row.projectName}-${row.clientName}-${row.totalRequirements}-mobile`}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
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

              <div className="flex flex-col gap-3 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">{showingText}</p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <div className="min-w-18 text-center text-sm font-semibold text-gray-700">
                    Page {safePage} of {totalPages}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main> */}
      </div>
    </div>
  );
}
