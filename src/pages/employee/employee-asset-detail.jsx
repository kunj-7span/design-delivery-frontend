import { useState, useRef } from "react";
import { ChevronRight, Upload, Bell, FileImage, FileText, FileCode } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormModal from "../../components/common/popup-modal";

export default function EmployeeAssetDetail() {
  const { id } = useParams();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleUploadSubmit = (formData) => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    // TODO: call API to upload new version
    toast.success("New version uploaded successfully");
    setUploadedFile(null);
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Asset Detail #{id}</h1>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Pending Review
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">v3</span>
              <span>•</span>
              <span>PNG</span>
              <span>•</span>
              <span>2.4 MB</span>
              <span>•</span>
              <span>Updated 2 hours ago by Sarah Jenkins</span>
            </div>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1e2a4a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a3b63] transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload New Version
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Left Panel: Asset Image View */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 border border-dashed border-gray-200 p-12 min-h-125">
            </div>
          </div>

          {/* Right Panel: Comments */}
          <div className="w-full lg:w-96 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
            <div className="border-b border-gray-100 p-4">
              <h3 className="font-semibold text-[#1e2a4a] border-b-2 border-[#1e2a4a] pb-2 inline-block">Comments</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div className="text-center text-xs font-medium tracking-wide text-gray-400 uppercase">
                Today
              </div>

              {/* Single Static Comment */}
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

      <FormModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadedFile(null);
        }}
        title="Upload New Version"
        maxWidth="max-w-lg"
        submitText="Upload"
        showCancelButton
        cancelText="Cancel"
        submitClassName="font-semibold"
        fields={[
          {
            name: "versionNotes",
            label: "Version Notes",
            placeholder: "e.g. Updated contrast on header",
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
    </div>
  );
}
