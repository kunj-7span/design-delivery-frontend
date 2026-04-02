import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/DDLogoFull.png";
import {
  LayoutGrid,
  FolderOpen,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Folder,
  Check,
  Clock,
  Menu,
  X,
} from "lucide-react";

const flatProjectRows = [
  { name: "Logo Redesign", client: "Harsh bhai", total: "48", changes: "2" },
  { name: "Poster Redesign", client: "Dhruv bhai", total: "24", changes: "0" },
];

const activeProjectRows = [
  { name: "7Span Logo Redesign", client: "7Span", total: "36", changes: "1" },
  {
    name: "Accutech Logo Redesign",
    client: "Accutech",
    total: "52",
    changes: "4",
  },
];

const feedbackItems = [
  {
    company: "Asmita",
    quote: "Please make the logo 20% larger",
    project: "Logo Redesign",
    time: "1 hour ago",
  },
  {
    company: "Jeel",
    quote: "The color palette looks great!",
    project: "Poster Redesign",
    time: "3 hours ago",
  },
];

function ProjectSection({ title, rows, onProjectClick }) {
  const searchId = `search-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="mb-8 lg:mb-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <label className="sr-only" htmlFor={searchId}>
            Search projects
          </label>
          <input
            id={searchId}
            type="search"
            placeholder="Search projects..."
            className="w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:min-w-50 md:w-56"
          />
        </div>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article
            key={`${row.name}-${row.client}-card`}
            role="button"
            tabIndex={0}
            onClick={() => onProjectClick?.(row)}
            onKeyDown={(e) => {
              if (!onProjectClick) return;
              if (e.key === "Enter" || e.key === " ") onProjectClick(row);
            }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-bold text-gray-900">{row.name}</h3>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Client name</dt>
                <dd className="font-medium text-gray-800">{row.client}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Total creative</dt>
                <dd className="font-medium text-gray-800">{row.total}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Requires changes</dt>
                <dd className="font-medium text-gray-800">{row.changes}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-150 text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Project name
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Client name
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Total creative
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Requires changes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.name}-${row.client}-table`}
                role="button"
                tabIndex={0}
                onClick={() => onProjectClick?.(row)}
                onKeyDown={(e) => {
                  if (!onProjectClick) return;
                  if (e.key === "Enter" || e.key === " ") onProjectClick(row);
                }}
                className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
              >
                <td className="px-4 py-4 font-bold text-gray-900">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-gray-700">{row.client}</td>
                <td className="px-4 py-4 text-gray-700">{row.total}</td>
                <td className="px-4 py-4 text-gray-700">{row.changes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const DesignerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Link to="/">
            <img src={logo} className="w-30 sm:w-32 md:w-34 lg:w-36" alt="" />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
          <Link
            to="/designer"
            className="flex items-center gap-3 rounded-lg bg-sky-100 px-3 py-2.5 text-sm font-semibold text-sky-700"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutGrid className="h-5 w-5 shrink-0" aria-hidden />
            Dashboard
          </Link>
          <Link
            to="/designer/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200/80"
            onClick={() => setSidebarOpen(false)}
          >
            <FolderOpen className="h-5 w-5 shrink-0" aria-hidden />
            Projects
          </Link>
        </nav>

        <div className="border-t border-gray-200 px-3 py-4">
          <a
            href="#settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/80"
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
            <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
              Dashboard
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-gray-50 sm:gap-3 sm:pr-3"
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

        <main className="flex-1 bg-gray-50/80 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-5 hover:bg-sky-100 cursor-pointer shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                      Active projects
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-sky-700">
                      12
                    </p>
                  </div>
                  <div className="rounded-lg bg-sky-100/80 p-2 text-sky-600">
                    <Folder className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm hover:bg-emerald-100 cursor-pointer">
                <div className="flex items-start justify-between gap-3 ">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                      Approved
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-700">
                      3
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-600">
                    <Check className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 cursor-pointer p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-rose-600 ">
                      Overdue
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-rose-700">
                      2
                    </p>
                  </div>
                  <div className="rounded-lg bg-rose-100/80 p-2 text-rose-600">
                    <Clock className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-10" id="projects">
              <ProjectSection title="Flat Projects" rows={flatProjectRows} />
              <ProjectSection
                title="My Active Projects"
                rows={activeProjectRows}
              />
            </div>

            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <h2 className="border-b border-gray-100 px-4 py-4 text-lg font-bold text-gray-900 sm:px-6">
                Recent Feedback
              </h2>
              <ul className="divide-y divide-gray-100">
                {feedbackItems.map((item) => (
                  <li
                    key={`${item.company}-${item.time}`}
                    className="px-4 py-4 sm:px-6"
                  >
                    <p className="text-sm leading-relaxed text-gray-800">
                      <span className="font-semibold">{item.company}</span>{" "}
                      commented{" "}
                      <q className="italic text-gray-700">
                        &ldquo;{item.quote}&rdquo;
                      </q>{" "}
                      on project{" "}
                      <span className="font-semibold">{item.project}</span>.
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{item.time}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignerDashboard;
