import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

import {
  FolderOpen,
  Folder,
  Check,
  Clock,

} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { getEmployeeDashboardSummary } from "../../services/employee-services";

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

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // Clear auth from Zustand
    navigate("/login");
  };

  // Fetch dashboard summary from API
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeDashboardSummary();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

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
                <p className="mt-2 text-3xl font-bold text-sky-700">{loading ? "..." : dashboardData?.activeProjects ?? 0}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 text-blue-500">
                <FolderOpen className="h-5 w-5" aria-hidden />
              </div>
              {/* <div className="rounded-lg bg-sky-100/80 p-2 text-sky-600">
                <Folder className="h-5 w-5" aria-hidden />
              </div> */}
            </div>
          </div>{" "}
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  completed Projects
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{loading ? "..." : dashboardData?.completedProjects ?? 0}</p>
              </div>
              <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-600">
                <Check className="h-5 w-5" aria-hidden />
              </div>
              {/* <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-600">
                <Folder className="h-5 w-5" aria-hidden />
              </div> */}
            </div>
          </div>{" "}
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-3 ">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide  text-rose-600">
                  overDue Requirements
                </p>
                <p className="mt-2 text-3xl font-bold text-rose-700">{loading ? "..." : dashboardData?.overdueRequirements ?? 0}</p>
              </div>

              <div className="rounded-lg bg-red-200/90 p-2 text-red-700">
                <Flame className="h-5 w-5" aria-hidden />
              </div>
              {/* <div className="rounded-lg bg-rose-100/80 p-2 text-rose-600">
                <Check className="h-5 w-5" aria-hidden />
              </div> */}
            </div>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-600 ">
                  inProgress Requirements
                </p>
                <p className="mt-2 text-3xl font-bold text-yellow-700">{loading ? "..." : dashboardData?.inProgressRequirements ?? 0}</p>
              </div>
              <div className="rounded-lg bg-yellow-100/80 p-2 text-yellow-600">
                <Clock className="h-5 w-5" aria-hidden />
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  approve Assets
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-700">{loading ? "..." : dashboardData?.approvedAssets ?? 0}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                <Folder className="h-5 w-5" aria-hidden />
              </div>
              {/* <div className="rounded-lg bg-sky-100/80 p-2 text-sky-600">
                <Folder className="h-5 w-5" aria-hidden />
              </div> */}
            </div>
          </div>
          {/* <div className="rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-start justify-between gap-3 ">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide  text-rose-600">
                  overDue Requirements
                </p>
                <p className="mt-2 text-3xl font-bold text-rose-700">0</p>
              </div>

              <div className="rounded-lg bg-red-200/90 p-2 text-red-700">
                <Flame className="h-5 w-5" aria-hidden />
              </div>
              <div className="rounded-lg bg-rose-100/80 p-2 text-rose-600">
                <Check className="h-5 w-5" aria-hidden />
              </div>
            </div>
          </div> */}
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

export default EmployeeDashboard;