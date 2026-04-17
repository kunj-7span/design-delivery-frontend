import { useEffect, useRef, useState } from "react";
import { Search, Filter, Plus, FileImage, FileText, FileCode } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormModal from "../../components/common/popup-modal";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

// ─── Static placeholder data (replace with API call) ─────────────────────────
const STATIC_ASSETS = [
  { id: 1, name: "Hero_Desktop_v3.png", fileType: "PNG Image", currentVersion: "3.0", uploadedDate: "Oct 12, 2023" },
  { id: 2, name: "Hero_Mobile_v2.png", fileType: "PNG Image", currentVersion: "2.0", uploadedDate: "Oct 10, 2023" },
  { id: 3, name: "Styleguide_v1.pdf", fileType: "PDF Document", currentVersion: "1.0", uploadedDate: "Oct 05, 2023" },
  { id: 4, name: "Iconography_Set.svg", fileType: "SVG Graphics", currentVersion: "4.0", uploadedDate: "Sep 28, 2023" },
  { id: 5, name: "Typography_Config.json", fileType: "JSON Data", currentVersion: "1.0", uploadedDate: "Sep 25, 2023" },
  { id: 6, name: "Banner_v1.png", fileType: "PNG Image", currentVersion: "1.0", uploadedDate: "Sep 20, 2023" },
];

// ─── Table column definitions ─────────────────────────────────────────────────
const assetColumns = [
  { key: "name", label: "Asset Name", cellClassName: "px-4 py-4 md:px-6 font-semibold text-gray-900" },
  { key: "fileType", label: "File Type", cellClassName: "px-4 py-4 md:px-6 text-gray-700" },
  { key: "currentVersion", label: "Current Version", cellClassName: "px-4 py-4 md:px-6 text-gray-700" },
  { key: "uploadedDate", label: "Uploaded Date", cellClassName: "px-4 py-4 md:px-6 text-gray-700" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function EmployeeAssetList() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [allAssets, setAllAssets] = useState(STATIC_ASSETS);
  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // ── Upload handlers ────────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const getFileType = (fileName) => {
    if (!fileName) return "Unknown File";
    const ext = fileName.split('.').pop().toUpperCase();
    if (['PNG', 'JPG', 'JPEG'].includes(ext)) return `${ext} Image`;
    if (ext === 'PDF') return `PDF Document`;
    if (ext === 'SVG') return `SVG Graphics`;
    if (ext === 'JSON') return `JSON Data`;
    return `${ext} File`;
  };

  const handleUploadSubmit = (formData) => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const newAsset = {
      id: Date.now(),
      name: formData.assetName || uploadedFile.name,
      fileType: getFileType(uploadedFile.name),
      currentVersion: "1.0",
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      internalNotes: formData.internalNotes || ""
    };

    setAllAssets(prev => [newAsset, ...prev]);

    // TODO: call POST upload API here later
    // console.log("Upload payload:", { ...formData, file: uploadedFile });

    toast.success("Asset uploaded successfully");
    setUploadedFile(null);
    setShowUploadModal(false);
  };

  // Derive unique file types from fetched data
  const fileTypes = [...new Set(assets.map((a) => a.fileType))];

  // ── Fetch assets ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 300)); // simulate network delay

        let filtered = allAssets;
        if (selectedFileTypes.length > 0) {
          filtered = filtered.filter((a) => selectedFileTypes.includes(a.fileType));
        }
        const q = query.trim().toLowerCase();
        if (q) {
          filtered = filtered.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.fileType.toLowerCase().includes(q) ||
              a.currentVersion.toLowerCase().includes(q) ||
              a.uploadedDate.toLowerCase().includes(q),
          );
        }
        const pages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const page = filtered.slice(from, from + ITEMS_PER_PAGE);

        setAssets(page);
        setTotalPages(pages);
        setTotalAssets(filtered.length);
        // ── End static simulation ─────────────────────────────────────────
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [currentPage, query, selectedFileTypes, allAssets]);

  // Reset to page 1 when filters / search change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedFileTypes]);

  // ── Close filter panel on Escape ───────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowFilters(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Close filter panel on outside click ───────────────────────────────────
  useEffect(() => {
    if (!showFilters) return;
    const onClick = (e) => {
      if (
        !e.target.closest("#asset-filter-panel") &&
        !e.target.closest("#asset-filter-btn")
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showFilters]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="p-4 md:p-6 min-h-screen">
        <main>
          <div className="mx-auto max-w-7xl">

            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-heading font-bold text-gray-900 flex items-center gap-3">
                Creative Assets
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage and version control your design deliverables.
              </p>
            </div>

            {/* Table Section */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

              {/* Toolbar: Search | Filter | Upload Asset */}
              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">

                {/* Search */}
                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />


                    <input
                      id="asset-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="search"
                      placeholder="Search assets..."
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <span className="text-sm bg-gray-200 px-3 py-1 rounded-full font-normal">
                    {totalAssets} Total
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  {/* Filter Button + Dropdown */}
                  <div className="relative">
                    <button
                      id="asset-filter-btn"
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      {selectedFileTypes.length > 0 && (
                        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                          {selectedFileTypes.length}
                        </span>
                      )}
                    </button>

                    {showFilters && (
                      <div
                        id="asset-filter-panel"
                        className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-gray-100 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            File Type
                          </p>
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                          {fileTypes.map((type) => (
                            <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFileTypes.includes(type)}
                                onChange={(e) => {
                                  setSelectedFileTypes(
                                    e.target.checked
                                      ? [...selectedFileTypes, type]
                                      : selectedFileTypes.filter((t) => t !== type),
                                  );
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">{type}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2 border-t border-gray-100 p-4">
                          <button
                            type="button"
                            onClick={() => setSelectedFileTypes([])}
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

                  {/* Upload Asset Button */}
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-hover-primary transition-colors active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    Upload Asset
                  </button>
                </div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                  Loading assets...
                </div>
              ) : assets.length > 0 ? (
                <>
                  <div className="w-full overflow-x-auto">
                    <Table
                      data={assets}
                      columns={assetColumns}
                      renderActions={false}
                      onRowClick={(item) => navigate(`/employee/employee-projects/employee-asset-detail/${item.id}`)}
                      rowClassName={() => "hover:bg-gray-50 bg-white cursor-pointer"}
                      tableClassName="w-full min-w-[600px] text-left text-sm"
                    />
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      if (p < 1 || p > totalPages) return;
                      setCurrentPage(p);
                    }}
                  />
                </>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2">
                  <Search className="h-8 w-8 text-gray-300" />
                  <p className="text-sm font-medium text-gray-400">No assets found</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* ── Upload Asset Modal ─────────────────────────────────────────── */}
      <FormModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadedFile(null);
        }}
        title="Upload New Creative"
        maxWidth="max-w-lg"
        submitText="Upload"
        showCancelButton
        cancelText="Cancel"
        submitClassName="font-semibold"
        fields={[
          {
            name: "assetName",
            label: "Asset Name",
            placeholder: "e.g. Homepage Hero V3",
            type: "text",
          },
        ]}
        onSubmit={handleUploadSubmit}
        renderContent={({ register, errors }) => (
          <div className="flex flex-col gap-4">

            {/* File Upload Drop Zone */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">File Upload</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${dragActive
                  ? "border-[#1e2a4a] bg-slate-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
              >
                {/* File type icons */}
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                    <FileText className="h-5 w-5 text-red-500" />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                    <FileImage className="h-5 w-5 text-blue-500" />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                    <FileCode className="h-5 w-5 text-green-500" />
                  </span>
                </div>

                {uploadedFile ? (
                  <p className="text-sm font-medium text-gray-700">{uploadedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, PNG, or JPG (MAX. 25MB)</p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.svg,.json"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Internal Notes <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                {...register("internalNotes")}
                rows={3}
                placeholder="Add any specific instructions for the review team..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none focus:ring-1 focus:ring-[#1e2a4a] focus:border-[#1e2a4a] transition-colors"
              />
            </div>

          </div>
        )}
      />
    </>
  );
}