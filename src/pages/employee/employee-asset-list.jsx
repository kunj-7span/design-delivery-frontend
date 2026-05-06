import { useEffect, useRef, useState } from "react";
import { Search, Filter, Plus, FileImage, FileText, FileCode } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FormModal from "../../components/common/popup-modal";
import Table from "../../components/common/table";
import Pagination from "../../components/common/pagination";
import { getRequirementAssets, getAssetUploadUrl, uploadFileToS3, saveAssetMetadata } from "../../services/employee-services";

const ITEMS_PER_PAGE = 5;

const assetColumns = [
  { key: "asset_name", label: "Asset Name", cellClassName: "px-4 py-4 md:px-6 font-semibold text-gray-900 break-words max-w-[200px] md:max-w-xs", render: (value, item) => value || item.asset_name || "-" },
  { key: "file_type", label: "File Type", cellClassName: "px-4 py-4 md:px-6 text-gray-700", render: (value, item) => value || item.file_type || "Unknown" },
  { key: "version_no", label: "Current Version", cellClassName: "px-4 py-4 md:px-6 text-gray-700", render: (value, item) => value || item.version_no || "1.0" },
  {
    key: "uploaded_date",
    label: "Uploaded Date",
    cellClassName: "px-4 py-4 md:px-6 text-gray-700",
    render: (value, item) => {
      const d = value || item.uploaded_date;
      return d ? new Date(d).toLocaleDateString() : "-";
    }
  },
  {
    key: "status",
    label: "Status",
    cellClassName: "px-4 py-4 md:px-6",
    render: (value, item) => {
      const s = (value || item.status || "").toLowerCase();
      const styles = {
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-600",
      };
      return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[s] || "bg-gray-100 text-gray-600"}`}>
          {s || "Unknown"}
        </span>
      );
    }
  }
];

export default function EmployeeAssetList() {
  const { id } = useParams();
  const location = useLocation();
  const projectId = location.state?.projectId || "0";

  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

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

  const handleUploadSubmit = async (formData) => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    try {
      setUploading(true);

      // Get S3 pre-signed upload URL
      const urlRes = await getAssetUploadUrl(projectId, id, {
        fileName: uploadedFile.name,
        contentType: uploadedFile.type,
      });
      const { uploadUrl, fileUrl } = urlRes.data;


      if (!uploadUrl || !fileUrl) {
        throw new Error("Failed to get upload URL");
      }

      // Upload file directly to S3
      await uploadFileToS3(uploadUrl, uploadedFile);

      // Save asset metadata to DB
      await saveAssetMetadata(projectId, id, {
        title: formData.assetName || uploadedFile.name,
        asset_link: fileUrl,
        internal_notes: formData.internalNotes || "",
      });

      toast.success("Asset uploaded successfully!");
      setUploadedFile(null);
      setShowUploadModal(false);
      // Refresh the assets list
      setCurrentPage(1);
      setQuery("");
      setSelectedStatuses([]);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchAssets = async () => {
      try {
        setLoading(true);

        const statusQuery = selectedStatuses.length > 0 ? selectedStatuses.join(",") : "all";

        const res = await getRequirementAssets(projectId, id, {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: query,
          sort: "date",
          status: statusQuery,
        });

        if (res && res.data) {
          setAssets(res.data);
          setTotalPages(res.meta?.totalPages || 1);
          setTotalAssets(res.meta?.total || res.data.length);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchAssets(), 300);
    return () => clearTimeout(timer);
  }, [currentPage, query, id, projectId, selectedStatuses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedStatuses]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowFilters(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  const uniqueStatuses = ["pending", "approved", "rejected"];

  return (
    <>
      <div className="p-4 md:p-6 min-h-screen">
        <main>
          <div className="mx-auto max-w-7xl">

            <div className="mb-6">
              <h2 className="text-heading font-bold text-gray-900 flex items-center gap-3">
                Creative Assets
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage and version control your design deliverables.
              </p>
            </div>

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">

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

                  <div className="relative">
                    <button
                      id="asset-filter-btn"
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
                        id="asset-filter-panel"
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg"
                      >
                        <div className="border-b border-gray-100 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Status
                          </p>
                        </div>
                        <div className="space-y-2.5 px-4 py-3">
                          {uniqueStatuses.map((status) => (
                            <label key={status} className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedStatuses.includes(status)}
                                onChange={(e) => {
                                  setSelectedStatuses(
                                    e.target.checked
                                      ? [...selectedStatuses, status]
                                      : selectedStatuses.filter((s) => s !== status),
                                  );
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700 capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2 border-t border-gray-100 p-4">
                          <button
                            type="button"
                            onClick={() => setSelectedStatuses([])}
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
                      onRowClick={(item) =>
                        navigate(
                          `/employee/employee-projects/employee-asset-detail/${item.asset_id}`,
                          {
                            state: {
                              projectId,
                              requirementId: id,
                              versionNo: item.version_no || 1,
                            },
                          }
                        )
                      }
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
                  <p className="text-sm font-medium text-gray-700 wrap-break-word text-center px-4 w-full">
                    {uploadedFile.name}
                  </p>
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