import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const REQUIREMENTS = [
    {
        id: 1,
        name: "Homepage_Hero_Desktop",
        fileType: ".PNG",
        fileSize: "2.4 MB",
        type: "Banners",
        typeColor: "sky",
        status: "APPROVED",
        statusColor: "emerald",
        totalAssets: 12,
        assetsLabel: "12 designs",
        deadline: "Oct 24, 2023",
        comments: 4,
    },
    {
        id: 2,
        name: "Brand_Guidelines_2023",
        fileType: ".PDF",
        fileSize: "8.1 MB",
        type: "Logo",
        typeColor: "blue",
        status: "IN PROGRESS",
        statusColor: "sky",
        totalAssets: 8,
        assetsLabel: "8 designs",
        deadline: "Oct 23, 2023",
        comments: 0,
    },
    {
        id: 3,
        name: "Product_Demo_Teaser",
        fileType: ".MP4",
        fileSize: "145 MB",
        type: "Ad Creative",
        typeColor: "rose",
        status: "TODO",
        statusColor: "gray",
        totalAssets: 15,
        assetsLabel: "15 designs",
        deadline: "Oct 22, 2023",
        comments: 12,
    },
    {
        id: 4,
        name: "About_Us_Team_Photo",
        fileType: ".JPG",
        fileSize: "4.2 MB",
        type: "Social Media Post",
        typeColor: "orange",
        status: "IN PREVIEW",
        statusColor: "violet",
        totalAssets: 6,
        assetsLabel: "6 designs",
        deadline: "Oct 21, 2023",
        comments: 2,
    },
    {
        id: 5,
        name: "Newsletter_Banner_Oct",
        fileType: ".PNG",
        fileSize: "1.8 MB",
        type: "Banners",
        typeColor: "sky",
        status: "APPROVED",
        statusColor: "emerald",
        totalAssets: 3,
        assetsLabel: "3 designs",
        deadline: "Oct 20, 2023",
        comments: 1,
    },
    {
        id: 6,
        name: "Mobile_App_Splash",
        fileType: ".PNG",
        fileSize: "3.6 MB",
        type: "Ad Creative",
        typeColor: "rose",
        status: "IN PROGRESS",
        statusColor: "sky",
        totalAssets: 9,
        assetsLabel: "9 designs",
        deadline: "Oct 19, 2023",
        comments: 5,
    },
    {
        id: 7,
        name: "Email_Header_Template",
        fileType: ".PSD",
        fileSize: "12.4 MB",
        type: "Logo",
        typeColor: "blue",
        status: "TODO",
        statusColor: "gray",
        totalAssets: 4,
        assetsLabel: "4 designs",
        deadline: "Oct 18, 2023",
        comments: 0,
    },
    {
        id: 8,
        name: "Infographic_Q3_Results",
        fileType: ".AI",
        fileSize: "7.2 MB",
        type: "Social Media Post",
        typeColor: "orange",
        status: "APPROVED",
        statusColor: "emerald",
        totalAssets: 2,
        assetsLabel: "2 designs",
        deadline: "Oct 17, 2023",
        comments: 8,
    },
    {
        id: 9,
        name: "Video_Thumbnail_Series",
        fileType: ".PNG",
        fileSize: "1.1 MB",
        type: "Banners",
        typeColor: "sky",
        status: "IN PREVIEW",
        statusColor: "violet",
        totalAssets: 10,
        assetsLabel: "10 designs",
        deadline: "Oct 16, 2023",
        comments: 3,
    },
    {
        id: 10,
        name: "Packaging_Design_V2",
        fileType: ".PDF",
        fileSize: "22.3 MB",
        type: "Ad Creative",
        typeColor: "rose",
        status: "IN PROGRESS",
        statusColor: "sky",
        totalAssets: 7,
        assetsLabel: "7 designs",
        deadline: "Oct 15, 2023",
        comments: 6,
    },
];

const PROJECT_INFO = {
    name: "Website Redesign",
};

const TYPE_COLORS = {
    sky: "bg-sky-100 text-sky-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
    orange: "bg-orange-100 text-orange-700",
};

const STATUS_COLORS = {
    emerald: "bg-emerald-100 text-emerald-700",
    sky: "bg-sky-100 text-sky-700",
    gray: "bg-gray-100 text-gray-700",
    violet: "bg-violet-100 text-violet-700",
};

function TypeBadge({ type, colorKey }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full min-w-27.5 px-3 py-1 text-xs font-semibold whitespace-nowrap ${TYPE_COLORS[colorKey] || TYPE_COLORS.sky}`}
        >
            {type}
        </span>
    );
}

function StatusBadge({ status, colorKey }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full min-w-27.5 px-3 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${STATUS_COLORS[colorKey] || STATUS_COLORS.gray}`}
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
        key: "name",
        label: "Requirement Name",
        cellClassName: "px-4 py-4 md:px-6",
        render: (value, item) => (
            <>
                <div className="font-bold text-gray-900">{value}</div>
                <div className="mt-0.5 text-xs text-gray-400">
                    {item.fileType} • {item.fileSize}
                </div>
            </>
        ),
    },
    {
        key: "type",
        label: "Type",
        cellClassName: "px-4 py-4 md:px-6",
        render: (value, item) => (
            <TypeBadge type={value} colorKey={item.typeColor} />
        ),
    },
    {
        key: "status",
        label: "Status",
        cellClassName: "px-4 py-4 md:px-6",
        render: (value, item) => (
            <StatusBadge status={value} colorKey={item.statusColor} />
        ),
    },
    {
        key: "assetsLabel",
        label: "Total Assets",
        cellClassName: "px-4 py-4 text-gray-700 md:px-6",
    },
    {
        key: "deadline",
        label: "Deadline",
        cellClassName: "px-4 py-4 text-gray-700 md:px-6",
    },
    {
        key: "comments",
        label: "Comments",
        cellClassName: "px-4 py-4 text-gray-700 md:px-6",
    }
];

/* ─── main component ─── */
export default function EmployeeProjectsRequirement() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const pageSize = 4;

    const uniqueStatuses = [...new Set(REQUIREMENTS.map((r) => r.status))];
    const uniqueTypes = [...new Set(REQUIREMENTS.map((r) => r.type))];

    /* close filter dropdown on Escape */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setShowFilters(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    /* close filter dropdown when clicking outside */
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

    /* filtering logic */
    const filteredRows = useMemo(() => {
        let results = REQUIREMENTS;

        if (selectedStatuses.length > 0) {
            results = results.filter((r) => selectedStatuses.includes(r.status));
        }

        if (selectedTypes.length > 0) {
            results = results.filter((r) => selectedTypes.includes(r.type));
        }

        const q = query.trim().toLowerCase();
        if (q) {
            results = results.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.type.toLowerCase().includes(q) ||
                    r.status.toLowerCase().includes(q) ||
                    r.deadline.toLowerCase().includes(q),
            );
        }
        return results;
    }, [query, selectedStatuses, selectedTypes]);

    /* pagination logic */
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

    useEffect(() => {
        setPage(1);
    }, [query, selectedStatuses, selectedTypes]);

    const safePage = Math.min(page, totalPages);
    const fromIdx = (safePage - 1) * pageSize;
    const toIdx = Math.min(fromIdx + pageSize, filteredRows.length);
    const pageRows = filteredRows.slice(fromIdx, toIdx);

    /* summary stats */
    const totalReqs = REQUIREMENTS.length;
    const pendingReview = REQUIREMENTS.filter(
        (r) => r.status === "IN PREVIEW",
    ).length;
    const changesRequested = REQUIREMENTS.filter(
        (r) => r.status === "TODO",
    ).length;
    const approvedAssets = REQUIREMENTS.filter(
        (r) => r.status === "APPROVED",
    ).length;

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <main>
                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-5 flex items-center gap-1.5 text-sm text-gray-500"
                    >
                        <Link
                            to="/employee/employee-dashboard"
                            className="hover:text-gray-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link
                            to="/employee/employee-projects"
                            className="hover:text-gray-700 transition-colors"
                        >
                            Projects
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="font-semibold text-gray-900">
                            {PROJECT_INFO.name}
                        </span>
                    </nav>

                    {/* Project Header */}
                    <div className="mb-6">
                        <h2 className="text-heading font-bold text-gray-900">
                            {PROJECT_INFO.name}
                        </h2>
                    </div>

                    {/* Stat Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            value={totalReqs}
                            label="Total Requirements"
                            icon={LayoutGrid}
                            colorScheme="blue"
                        />
                        <StatCard
                            value={pendingReview}
                            label="Pending Review"
                            icon={MessageSquare}
                            colorScheme="amber"
                        />
                        <StatCard
                            value={changesRequested}
                            label="Changes Requested"
                            icon={AlertTriangle}
                            colorScheme="rose"
                        />
                        <StatCard
                            value={approvedAssets}
                            label="Approved Assets"
                            icon={CheckCircle2}
                            colorScheme="emerald"
                        />
                    </div>

                    {/* Requirements Section */}
                    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        {/* Section Header with Search & Filter */}
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

                                {/* Filter Button */}
                                <div className="relative">
                                    <button
                                        id="filter-btn"
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filter
                                        {selectedStatuses.length + selectedTypes.length > 0 && (
                                            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                                                {selectedStatuses.length + selectedTypes.length}
                                            </span>
                                        )}
                                    </button>

                                    {/* Filter dropdown */}
                                    {showFilters && (
                                        <div
                                            id="filter-panel"
                                            className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg animate-slide-in"
                                        >
                                            {/* Status filters */}
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

                                            {/* Type filters */}
                                            <div className="border-t border-b border-gray-100 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Type
                                                </p>
                                            </div>
                                            <div className="space-y-2.5 px-4 py-3">
                                                {uniqueTypes.map((type) => (
                                                    <label
                                                        key={type}
                                                        className="flex items-center gap-2.5 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTypes.includes(type)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedTypes([...selectedTypes, type]);
                                                                } else {
                                                                    setSelectedTypes(
                                                                        selectedTypes.filter((t) => t !== type),
                                                                    );
                                                                }
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {type}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 border-t border-gray-100 p-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStatuses([]);
                                                        setSelectedTypes([]);
                                                    }}
                                                    className="flex-1 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowFilters(false)}
                                                    className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition-colors"
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
                        {pageRows.length > 0 ? (
                            <>
                                <div className="w-full overflow-x-auto">
                                    <div className="min-w-[800px]">
                                            <Table
                                                data={pageRows}
                                                columns={requirementColumns}
                                                renderActions
                                                actionsHeaderLabel="Action"
                                                renderActionsCell={(item) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate("/employee/employee-projects/employee-asset-list")}
                                                        className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors active:scale-95"
                                                    >
                                                        Start Working
                                                    </button>
                                                )}
                                                rowClassName={(item) => "hover:bg-gray-50 bg-white"}
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
        </div>
    );
}