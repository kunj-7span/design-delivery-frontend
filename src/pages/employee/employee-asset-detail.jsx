import { useState, useRef, useEffect } from "react";
import { ChevronRight, Upload, FileImage, FileText, FileCode, ExternalLink } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FormModal from "../../components/common/popup-modal";
import {
  getAssetVersionDetails,
  getAssetUploadUrl,
  uploadFileToS3,
  saveAssetMetadata,
} from "../../services/employee-services";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
      {status || "Unknown"}
    </span>
  );
}

export default function EmployeeAssetDetail() {
  // Route params
  const { id: assetId } = useParams();           // assetId from URL
  const location = useLocation();
  const projectId = location.state?.projectId || "0";
  const requirementId = location.state?.requirementId || "0";
  const initialVersion = location.state?.versionNo || 1;

  // Asset data
  const [asset, setAsset] = useState(null);
  const [versionNo, setVersionNo] = useState(initialVersion);
  const [loading, setLoading] = useState(false);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch asset version details ──────────────────────────────────────────────
  useEffect(() => {
    if (!assetId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getAssetVersionDetails(projectId, requirementId, assetId, versionNo);
        if (res && res.data) setAsset(res.data);
      } catch (err) {
        console.error("Failed to load asset details:", err);
        toast.error("Could not load asset details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [assetId, versionNo, projectId, requirementId]);

  // ── File drag/drop ───────────────────────────────────────────────────────────
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

  // ── 3-step S3 upload ─────────────────────────────────────────────────────────
  const handleUploadSubmit = async (formData) => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    try {
      setUploading(true);

      // Step 1: Get pre-signed S3 URL
      toast.info("Requesting upload URL...", { autoClose: 1500 });
      const urlRes = await getAssetUploadUrl(projectId, requirementId, {
        fileName: uploadedFile.name,
        contentType: uploadedFile.type,
      });
      const { uploadUrl, fileUrl } = urlRes.data;

      // Step 2: Upload file directly to S3
      toast.info("Uploading file to S3...", { autoClose: 1500 });
      await uploadFileToS3(uploadUrl, uploadedFile);

      // Step 3: Save metadata — pass asset_id so backend creates a NEW VERSION
      toast.info("Saving new version...", { autoClose: 1500 });
      await saveAssetMetadata(projectId, requirementId, {
        title: formData.versionNotes || asset?.asset_name || uploadedFile.name,
        asset_link: fileUrl,
        internal_notes: formData.internalNotes || "",
        asset_id: assetId,              // signals backend to add a version
      });

      toast.success("New version uploaded successfully!");
      setUploadedFile(null);
      setShowUploadModal(false);
      // Reload latest version
      setVersionNo((v) => v + 1);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl p-4 md:p-6">

        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {loading ? "Loading..." : asset?.asset_name || `Asset #${assetId}`}
              </h1>
              {asset && <StatusBadge status={asset.status} />}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              {asset?.version_no != null && (
                <>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    v{asset.version_no}
                  </span>
                  <span>•</span>
                </>
              )}
              {asset?.file_type && (
                <>
                  <span>{asset.file_type}</span>
                  <span>•</span>
                </>
              )}
              {asset?.uploaded_date && (
                <span>
                  Uploaded {new Date(asset.uploaded_date).toLocaleDateString()}
                  {/* by{" "}
                  {asset.uploaded_by || "Unknown"} */}
                </span>
              )}
              {asset?.total_versions != null && (
                <>
                  <span>•</span>
                  <span>{asset.total_versions} version{asset.total_versions !== 1 ? "s" : ""} total</span>
                </>
              )}
            </div>
          </div>

          {asset?.status?.toLowerCase() === "rejected" && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1e2a4a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a3b63] transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload New Version
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Left Panel: Asset Preview */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {loading ? (
              <div className="flex min-h-75 items-center justify-center text-sm text-gray-400">
                Loading asset...
              </div>
            ) : asset?.asset_link ? (
              <div className="flex flex-col gap-4">
                {/* Image preview if applicable */}
                {/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(asset.asset_link) ? (
                  <img
                    src={asset.asset_link}
                    alt={asset.asset_name}
                    className="max-h-125 w-full rounded-lg object-contain border border-gray-100"
                  />
                ) : (
                  <div className="flex min-h-50 flex-col items-center justify-center gap-4 rounded-lg bg-gray-50 border border-dashed border-gray-200 p-12">
                    <FileText className="h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-500">{asset.file_type || "File"} — preview not available</p>
                  </div>
                )}

                {/* View link */}
                <a
                  href={asset.asset_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full File
                </a>
              </div>
            ) : (
              <div className="flex min-h-75 items-center justify-center rounded-lg bg-gray-50 border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">No asset preview available.</p>
              </div>
            )}
          </div>

          {/* Right Panel: Comments (static for now) */}
          <div className="w-full lg:w-96 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-gray-100 p-4">
              <h3 className="font-semibold text-[#1e2a4a] border-b-2 border-[#1e2a4a] pb-2 inline-block">
                Comments
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div className="text-center text-xs font-medium tracking-wide text-gray-400 uppercase">
                Today
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-100">
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Lisa Chen"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Lisa Chen</span>
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 tracking-wider">
                        CLIENT
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">11:15 AM</span>
                </div>

                <div className="ml-10 rounded-2xl rounded-tl-none bg-[#f8f5ff] p-4 text-sm text-gray-700">
                  <p>The header image looks great! Let's just make sure the text overlay is legible on mobile devices too.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Upload New Version Modal */}
      <FormModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadedFile(null);
        }}
        title="Upload New Version"
        maxWidth="max-w-lg"
        submitText={uploading ? "Uploading..." : "Upload"}
        showCancelButton
        cancelText="Cancel"
        submitClassName="font-semibold"
        fields={[]}
        onSubmit={handleUploadSubmit}
        renderContent={({ register }) => (
          <div className="flex flex-col gap-4">

            {/* Asset Name — read-only, pre-filled */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Asset Name</label>
              <input
                type="text"
                value={asset?.asset_name || ""}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed"
              />
            </div>

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
                    <p className="text-xs text-gray-400">PDF, PNG, JPG, MP4 (MAX. 5MB)</p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,.pdf,.doc,.docx"
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
    </div>
  );
}
