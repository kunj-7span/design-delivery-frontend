import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Filter,
    Search,
    ChevronRight,
    LayoutGrid,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";
import InfoModal from "../../components/common/info-modal";
import { getEmployeeProjectSummary, getEmployeeProjectRequirements } from "../../services/employee-services";

const ITEMS_PER_PAGE = 10;

const UI_STATUSES = ["Pending Review", "Todo", "In Progress", "Complete"];
const API_STATUS_MAP = {
    "Pending Review": "pending",
    "Todo": "todo",
    "In Progress": "in_progress",
    "Complete": "complete"
};

const formatStatusToUI = (statusStr) => {
    if (statusStr === "pending") return "Pending";
    if (statusStr === "todo") return "Todo";
    if (statusStr === "in_progress") return "In Progress";
    if (statusStr === "complete") return "Complete";
    if (statusStr === "archived") return "Archived";
    return statusStr?.toUpperCase() || "";
};

const TYPE_COLORS = {
    branding: "bg-sky-100 text-sky-700",
    logo: "bg-blue-100 text-blue-700",
    video: "bg-rose-100 text-rose-700",
    social: "bg-orange-100 text-orange-700",
    default: "bg-gray-100 text-gray-700",
};

const STATUS_COLORS = {
    complete: "bg-emerald-100 text-emerald-700",
    in_progress: "bg-sky-100 text-sky-700",
    todo: "bg-gray-100 text-gray-700",
    pending: "bg-violet-100 text-violet-700",
    archived: "bg-gray-200 text-gray-400",
};

function TypeBadge({ type }) {
    const t = type?.toLowerCase() || '';
    const formattedType = t.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    let colorKey = 'default';
    if (t.includes('brand')) colorKey = 'branding';
    else if (t.includes('logo')) colorKey = 'logo';
    else if (t.includes('video')) colorKey = 'video';
    else if (t.includes('social')) colorKey = 'social';

    return (
        <span
            className={`inline-flex items-center justify-center rounded-full min-w-27.5 px-3 py-1 text-xs font-semibold whitespace-nowrap ${TYPE_COLORS[colorKey]}`}
        >
            {formattedType}
        </span>
    );
}

function StatusBadge({ status, originalStatus }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full min-w-27.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${STATUS_COLORS[originalStatus] || STATUS_COLORS.todo}`}
        >
            {status}
        </span>
    );
}

/* ─── stat card ─── */
function StatCard({ value, label, icon: Icon, colorScheme }) {
    const schemes = {
        blue: {
            border: "border-blue-100",
            bg: "bg-blue-50",
            text: "text-blue-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500",
        },
        amber: {
            border: "border-amber-100",
            bg: "bg-amber-50",
            text: "text-amber-600",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500",
        },
        rose: {
            border: "border-rose-100",
            bg: "bg-rose-50",
            text: "text-rose-600",
            iconBg: "bg-rose-100",
            iconColor: "text-rose-500",
        },
        emerald: {
            border: "border-emerald-100",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-500",
        },
    };

    const s = schemes[colorScheme] || schemes.blue;

    return (
        <div
            className={`rounded-xl border ${s.border} ${s.bg} p-5 shadow-sm transition-shadow hover:shadow-md`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-3xl font-bold tabular-nums text-gray-900">
                        {value}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${s.text}`}>{label}</p>
                </div>
                <div className={`rounded-lg ${s.iconBg} p-2.5 ${s.iconColor}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                </div>
            </div>
        </div>
    );
}

const requirementColumns = [
    {
        key: "title",
        label: "Requirement Name",
        headerClassName: "text-center",
        cellClassName: "px-4 py-4 md:px-6 text-center",
        render: (value, item) => (
            <div className={`font-bold ${item.status === "archived" ? "text-slate-400" : "text-gray-900"}`}>{value}</div>
        ),
    },
    {
        key: "type",
        label: "Type",
        headerClassName: "text-center",
        cellClassName: "px-4 py-4 md:px-6 text-center",
        render: (value, item) => (
            <div className={item.status === "archived" ? "opacity-45" : ""}>
                <TypeBadge type={value} />
            </div>
        ),
    },
    {
        key: "status",
        label: "Status",
        headerClassName: "text-center",
        cellClassName: "px-4 py-4 md:px-6 text-center",
        render: (value) => (
            <StatusBadge status={formatStatusToUI(value)} originalStatus={value} />
        ),
    },
    {
        key: "totalAssets",
        label: "Total Assets",
        headerClassName: "text-center",
        cellClassName: "px-4 py-4 text-gray-700 md:px-6 text-center",
        render: (value, item) => (
            <span className={item.status === "archived" ? "text-slate-400" : ""}>
                {`${value} files`}
            </span>
        ),
    },
    {
        key: "deadline",
        label: "Deadline",
        headerClassName: "text-center",
        cellClassName: "px-4 py-4 text-gray-700 md:px-6 text-center",
        render: (value, item) => (
            <span className={item.status === "archived" ? "text-slate-400" : ""}>
                {value ? new Date(value).toLocaleDateString() : "-"}
            </span>
        ),
    }
];

/* ─── main component ─── */
export default function EmployeeProjectsRequirement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    const [requirements, setRequirements] = useState([]);
    const [meta, setMeta] = useState({});
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);

    const uniqueStatuses = UI_STATUSES;

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setShowFilters(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!showFilters) return;
        const onClick = (e) => {
            if (
                !e.target.closest("#filter-panel") &&
                !e.target.closest("#filter-btn")
            ) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [showFilters]);

    // Fetch Summary
    useEffect(() => {
        if (!id) return;
        const fetchSummary = async () => {
            try {
                const res = await getEmployeeProjectSummary(id);
                if (res && res.data) {
                    setSummary(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            }
        };
        fetchSummary();
    }, [id]);

    // Fetch Requirements
    useEffect(() => {
        if (!id) return;
        const fetchReqs = async () => {
            try {
                setLoading(true);
                const apiStatuses = selectedStatuses.map(s => API_STATUS_MAP[s]).join(',');

                const res = await getEmployeeProjectRequirements(id, {
                    page,
                    limit: ITEMS_PER_PAGE,
                    search: query,
                    status: apiStatuses || undefined
                });

                if (res && res.data) {
                    setRequirements(res.data);
                    setMeta(res.meta || {});
                }
            } catch (err) {
                console.error("Failed to fetch requirements:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => fetchReqs(), 300);
        return () => clearTimeout(timer);
    }, [id, page, query, selectedStatuses]);

    useEffect(() => {
        setPage(1);
    }, [query, selectedStatuses]);

    const totalPages = meta.totalPages || 1;
    const safePage = Math.min(page, totalPages);

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <main>


                {/* Project Header */}
                <div className="mb-6">
                    <h2 className="text-heading font-bold text-gray-900">
                        {summary?.name || "Loading..."}
                    </h2>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        value={summary?.summaryCounts?.totalRequirements || 0}
                        label="Total Requirements"
                        icon={LayoutGrid}
                        colorScheme="blue"
                    />
                    <StatCard
                        value={summary?.summaryCounts?.pendingReview || 0}
                        label="Pending Review"
                        icon={MessageSquare}
                        colorScheme="amber"
                    />
                    <StatCard
                        value={summary?.summaryCounts?.changesRequested || 0}
                        label="Changes Requested"
                        icon={AlertTriangle}
                        colorScheme="rose"
                    />
                    <StatCard
                        value={summary?.summaryCounts?.approvedAssets || 0}
                        label="Approved Assets"
                        icon={CheckCircle2}
                        colorScheme="emerald"
                    />
                </div>

                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:p-6">
                        <h3 className="text-subheading font-bold text-gray-900">
                            Requirements
                        </h3>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative flex-1 sm:flex-initial">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="req-search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    type="search"
                                    placeholder="Search requirements..."
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:w-56"
                                />
                            </div>

                            <div className="relative">
                                <button
                                    id="filter-btn"
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
                                    <div
                                        id="filter-panel"
                                        className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg"
                                    >
                                        <div className="border-b border-gray-100 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </p>
                                        </div>
                                        <div className="space-y-2.5 px-4 py-3">
                                            {uniqueStatuses.map((status) => (
                                                <label
                                                    key={status}
                                                    className="flex items-center gap-2.5 cursor-pointer"
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
                                                        className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
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
                                                onClick={() => {
                                                    setSelectedStatuses([]);
                                                }}
                                                className="flex-1 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowFilters(false)}
                                                className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    {requirements.length > 0 ? (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-200">
                                    <Table
                                        data={requirements}
                                        columns={requirementColumns}
                                        renderActions
                                        actionsHeaderLabel="Action"
                                        renderActionsCell={(item) => {
                                            const isArchived = item.status === "archived";
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRequirement(item);
                                                        }}
                                                        className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold border border-gray-200 bg-white text-gray-700 shadow-sm cursor-pointer transition-colors hover:bg-gray-50 active:scale-95"
                                                    >
                                                        View Detail
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isArchived}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isArchived) return;
                                                            navigate(`/employee/employee-projects/employee-asset-list/${item.id}`, { state: { projectId: id } });
                                                        }}
                                                        className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm cursor-pointer transition-colors ${isArchived
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-sky-500 text-white hover:bg-sky-600 active:scale-95"
                                                            }`}
                                                    >
                                                        Start Working
                                                    </button>
                                                </div>
                                            );
                                        }}
                                        rowClassName={(item) =>
                                            item.status === "archived"
                                                ? "bg-slate-50 text-slate-300"
                                                : "hover:bg-gray-50 bg-white"
                                        }
                                    />
                                </div>
                            </div>


                            <Pagination
                                currentPage={safePage}
                                totalPages={totalPages}
                                onPageChange={(p) => {
                                    if (p < 1 || p > totalPages) return;
                                    setPage(p);
                                }}
                            />
                        </>
                    ) : (
                        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50">
                            <Search className="h-8 w-8 text-gray-300" />
                            <p className="text-sm font-medium text-gray-400">
                                No requirements found
                            </p>
                        </div>
                    )}
                </section>
            </main>

            <InfoModal
                isOpen={!!selectedRequirement}
                onClose={() => setSelectedRequirement(null)}
                title={selectedRequirement?.title || "Requirement Details"}
                maxWidth="max-w-lg"
                items={[
                    { label: "Title", value: selectedRequirement?.title, fullWidth: true },
                    { label: "Type", value: selectedRequirement?.type ? selectedRequirement.type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "-" },
                    { label: "Status", value: formatStatusToUI(selectedRequirement?.status) },
                    { label: "Total Assets", value: selectedRequirement?.totalAssets != null ? `${selectedRequirement.totalAssets} files` : "-" },
                    { label: "Deadline", value: selectedRequirement?.deadline ? new Date(selectedRequirement.deadline).toLocaleDateString() : "-" },
                    { label: "Created At", value: selectedRequirement?.createdAt ? new Date(selectedRequirement.createdAt).toLocaleDateString() : "-" },
                ]}
            />
        </div>
    );
}