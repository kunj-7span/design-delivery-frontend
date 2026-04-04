import React from "react";
import {
  FolderOpen,
  Layers,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  CheckCheck,
} from "lucide-react";

const statCards = [
  {
    icon: FolderOpen,
    iconBg: "bg-purple-100",
    iconColor: "text-[#6C63FF]",
    label: "Active Projects",
    value: "12",
    sub: "+2 this week",
    subColor: "text-gray-400",
  },
  {
    icon: Layers,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    label: "Total Assets",
    value: "148",
    sub: "+18 this week",
    subColor: "text-gray-400",
  },
  {
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    label: "Pending Review",
    value: "8",
    sub: "3 urgent",
    subColor: "text-gray-400",
  },
  {
    icon: AlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
    label: "Requires Changes",
    value: "3",
    valueColor: "text-red-500",
    sub: "Action needed",
    subColor: "text-gray-400",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    label: "Approved",
    value: "84",
    valueColor: "text-green-500",
    sub: "57% of total",
    subColor: "text-gray-400",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
    label: "Overdue",
    value: "2",
    valueColor: "text-red-500",
    sub: "Immediate",
    subColor: "text-gray-400",
  },
];

const projects = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    client: "Acme Corp",
    assets: "12 Files +9",
    status: "Inprogress",
    statusColor: "bg-purple-100 text-purple-600",
    due: "Oct 24",
    icon: "🌐",
    iconBg: "bg-purple-100",
  },
  {
    id: "q4-marketing",
    name: "Q4 Marketing",
    client: "Globex",
    assets: "45 Files",
    status: "Inprogress",
    statusColor: "bg-purple-100 text-purple-600",
    due: "Oct 28",
    icon: "📊",
    iconBg: "bg-yellow-100",
  },
  {
    id: "social-campaign",
    name: "Social Campaign",
    client: "Soylent",
    assets: "8 Files",
    status: "Backlog",
    statusColor: "bg-gray-100 text-gray-600",
    due: "Oct 30",
    icon: "📣",
    iconBg: "bg-orange-100",
  },
  {
    id: "logo-refresh",
    name: "Logo Refresh",
    client: "Umbrella",
    assets: "3 Files",
    status: "Completed",
    statusColor: "bg-green-100 text-green-600",
    due: "Nov 02",
    icon: "✅",
    iconBg: "bg-green-100",
  },
  {
    id: "brand-guidelines",
    name: "Brand Guidelines",
    client: "Initech",
    assets: "22 Files",
    status: "Inprogress",
    statusColor: "bg-purple-100 text-purple-600",
    due: "Nov 08",
    icon: "📐",
    iconBg: "bg-blue-100",
  },
];

const ClientDashboard = () => {
  return (
    <div className="p-8">
      {/* Work Summary */}
      <h2 className="text-lg font-bold text-gray-900 mb-5">Work Summary</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
              >
                <card.icon size={20} className={card.iconColor} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p
              className={`text-3xl font-bold mb-1 ${card.valueColor || "text-primary"}`}
            >
              {card.value}
            </p>
            <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* My Active Projects */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            My Active Projects
          </h2>
          <button
            // onClick={() => navigate("/app/projects")}
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-5 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
          <span>Project</span>
          <span>Client</span>
          <span>Assets</span>
          <span>Status</span>
          <span>Due Date</span>
        </div>

        <div className="space-y-1">
          {projects.map((project) => (
            <div
              key={project.id}
              //   onClick={() => navigate(`/app/projects/${project.id}`)}
              className="grid grid-cols-5 items-center py-3 px-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${project.iconBg} flex items-center justify-center text-sm`}
                >
                  {project.icon}
                </div>
                <span className="text-sm font-semibold text-primary">
                  {project.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {project.client}
              </span>
              <span className="text-sm text-gray-600">{project.assets}</span>
              <span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${project.statusColor}`}
                >
                  {project.status}
                </span>
              </span>
              <span className="text-sm text-gray-600">{project.due}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {/* <div className="fixed bottom-6 right-16 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 w-72">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCheck size={16} className="text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            Asset Uploaded Successfully
          </p>
          <p className="text-xs text-gray-500">Hero_v3_FINAL.png · Just now</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">✕</button>
      </div> */}
    </div>
  );
};

export default ClientDashboard;
