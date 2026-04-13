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
import { useNavigate } from "react-router-dom";
import profile from "../../assets/user-icon.png";
import { useAuthStore } from "../../store/auth-store";

const flatProjectRows = [
  { name: "Logo Redesign", client: "Harsh bhai", total: "0", changes: "0" },
  { name: "Poster Redesign", client: "Dhruv bhai", total: "0", changes: "0" },
];

const activeProjectRows = [
  { name: "7Span Logo Redesign", client: "7Span", total: "0", changes: "0" },
  {
    name: "Accutech Logo Redesign",
    client: "Accutech",
    total: "0",
    changes: "0",
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
            placeholder="Search projects"
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

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // Clear auth from Zustand
    navigate("/login");
  };

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

  // Get user from Zustand store
  const user = useAuthStore((state) => state.user);
  const userAvatarURL = useAuthStore((state) => state.user_avatarURL);

  return (
    <div className="p-4 md:p-6 min-h-screen">
        <main>
          
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              <div className="rounded-xl p-5 shadow-sm bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                      Active projects
                    </p>
                    <p className="mt-2 text-3xl font-bold text-sky-700">
                      0
                    </p>
                  </div>
                  <div className="rounded-lg bg-sky-100/80 p-2 text-sky-600">
                    <Folder className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-sm bg-white">
                <div className="flex items-start justify-between gap-3 ">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                      Approved
                    </p>
                    <p className="mt-2 text-3xl font-bold text-emerald-700">
                      0
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-600">
                    <Check className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-sm bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-rose-600 ">
                      Overdue
                    </p>
                    <p className="mt-2 text-3xl font-bold text-rose-700">
                      0
                    </p>
                  </div>
                  <div className="rounded-lg bg-rose-100/80 p-2 text-rose-600">
                    <Clock className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            

            <section className="mt-5 rounded-lg border border-gray-200 bg-white shadow-sm">
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
          
        </main>
    </div>
  );
};

export default DesignerDashboard;
