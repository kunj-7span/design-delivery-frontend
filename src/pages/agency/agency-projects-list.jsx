import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Folder,
  Users,
  UserCircle,
  Settings,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const AgencyProjectsList = () => {
  const [activePage, setActivePage] = useState("Projects"); // Navigation mate
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("All Projects");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allProjects = [
    {
      id: 1,
      name: "Mobile App Redesign",
      status: "ACTIVE",
      employees: 4,
      assets: 14,
      progress: 68,
      color: "bg-indigo-500",
      client: "TechNova",
      deadline: "Dec 2024",
      desc: "Modernizing mobile UX.",
    },
    {
      id: 2,
      name: "Q4 Marketing Portal",
      status: "BACKLOG",
      employees: 0,
      assets: 0,
      progress: 0,
      color: "bg-gray-300",
      client: "Global Sales",
      deadline: "Jan 2025",
      desc: "Asset management hub.",
    },
    {
      id: 3,
      name: "Corporate Website",
      status: "COMPLETED",
      employees: 1,
      assets: 21,
      progress: 100,
      color: "bg-emerald-500",
      client: "FinCorp",
      deadline: "Oct 2023",
      desc: "Full website build.",
    },
    {
      id: 4,
      name: "SaaS Dashboard UX",
      status: "ACTIVE",
      employees: 3,
      assets: 32,
      progress: 24,
      color: "bg-indigo-500",
      client: "Cloudly",
      deadline: "Mar 2025",
      desc: "Analytics components.",
    },
    {
      id: 5,
      name: "E-commerce Branding",
      status: "ACTIVE",
      employees: 2,
      assets: 8,
      progress: 92,
      color: "bg-indigo-500",
      client: "Shopify Plus",
      deadline: "Nov 2024",
      desc: "Brand identity.",
    },
    {
      id: 6,
      name: "SEO Strategy 2024",
      status: "ACTIVE",
      employees: 5,
      assets: 12,
      progress: 45,
      color: "bg-indigo-500",
      client: "MarketGo",
      deadline: "Feb 2025",
      desc: "Organic growth.",
    },
    {
      id: 7,
      name: "SEO",
      status: "ACTIVE",
      employees: 5,
      assets: 12,
      progress: 45,
      color: "bg-indigo-500",
      client: "MarketGo",
      deadline: "Feb 2025",
      desc: "Organic growth.",
    },
  ];

  const filteredData = useMemo(() => {
    return allProjects.filter((p) => {
      const matchTab =
        activeTab === "All Projects" ||
        (activeTab === "Completed" && p.status === "COMPLETED");
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" || p.status === statusFilter.toUpperCase();
      return matchTab && matchSearch && matchStatus;
    });
  }, [activeTab, allProjects, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentProjects = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex h-screen bg-[#F8F9FD] text-[#2D3748] font-sans overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activePage === "Dashboard" && (
              <div className="animate-in fade-in duration-400">
                <h2 className="text-3xl font-bold mb-6">
                  Welcome back, Kishan!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    icon={<Activity className="text-purple-600" />}
                    label="Total Projects"
                    value="24"
                    color="bg-purple-50"
                  />
                  <StatCard
                    icon={<BarChart3 className="text-blue-600" />}
                    label="Active Assets"
                    value="158"
                    color="bg-blue-50"
                  />
                  <StatCard
                    icon={<PieChart className="text-emerald-600" />}
                    label="Completion Rate"
                    value="84%"
                    color="bg-emerald-50"
                  />
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400">
                  Dashboard Analytics Visualization area...
                </div>
              </div>
            )}

            {activePage === "Projects" && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">Projects</h2>
                  <Link
                    to="/agency/create-project"
                    className="bg-primary hover:bg-hover-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100"
                  >
                    <Plus size={20} /> Create New Project
                  </Link>
                </div>

                <div className="flex gap-8 border-b border-gray-200 mb-6">
                  {[
                    "All Projects",
                    "Flat Projects",
                    "Assigned Projects",
                    "Completed",
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-sm font-bold transition-all relative "}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Filter  */}
                <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center flex-1 min-w-70">
                    <div className="relative flex-1 max-w-xs">
                      <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {/* <div className="relative">
                      <select className="appearance-none bg-gray-50 border-none px-4 py-2 pr-10 rounded-lg text-sm font-bold text-gray-600 outline-none cursor-pointer">
                        <option>Status: All</option>
                        <option>Status: Active</option>
                        <option>Status: Completed</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                        size={16}
                      />
                    </div> */}
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase border-y border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Project Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Progress</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="border-t border-gray-200">
                      {currentProjects.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-50/30 cursor-pointer"
                          onClick={() => setSelectedProject(p)}
                        >
                          <td className="px-6 py-5 font-bold text-gray-700 text-sm">
                            {p.name}
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.status === "ACTIVE" ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-500"}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3 w-40">
                              <span className="text-xs font-bold">
                                {p.progress}%
                              </span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${p.color}`}
                                  style={{ width: `${p.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button className="bg-primary hover:bg-hover-primary cursor-pointer text-white text-[10px] font-bold py-2 px-4 rounded-xl uppercase shadow-md shadow-indigo-100">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination placeholder */}
                  <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={`w-8 h-8 rounded-lg font-bold ${currentPage === 1 ? "bg-primary text-white" : "text-gray-400"}`}
                      >
                        1
                      </button>
                      <button
                        onClick={() => setCurrentPage(2)}
                        className={`w-8 h-8 rounded-lg font-bold ${currentPage === 2 ? "bg-primary hover:bg-hover-primary text-white" : "text-gray-400"}`}
                      >
                        2
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other pages */}
            {(activePage === "Clients" || activePage === "Employee") && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Users size={48} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold">
                  {activePage} Content Coming Soon
                </h3>
              </div>
            )}
          </div>
        </main>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{selectedProject.name}</h3>
                <button onClick={() => setSelectedProject(null)}>
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                {selectedProject.desc}
              </p>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-4 bg-primary hover:bg-hover-primary text-white rounded-2xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar Nav Item Component
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-primary text-white shadow-lg shadow-indigo-200 font-bold"
        : "text-gray-400 hover:bg-gray-50 font-semibold"
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </div>
);

// Dashboard Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AgencyProjectsList;
