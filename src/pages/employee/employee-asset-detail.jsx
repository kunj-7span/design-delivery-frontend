import { useState } from "react";
import { ChevronRight, Upload, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeAssetDetail() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Homepage_Hero_Desktop</h1>
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
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#1e2a4a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a3b63] transition-colors">
            <Upload className="h-4 w-4" />
            Upload New Version
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Left Panel: Asset Image View */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center rounded-lg bg-gray-50 border border-dashed border-gray-200 p-12 min-h-[500px]">
              {/* Static Placeholder for Image */}
              {/* <div className="relative w-full max-w-2xl bg-[#8ba4a1] shadow-2xl rounded-sm p-12 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div className="font-bold text-gray-800">EasyPay</div>
                    <div className="hidden sm:flex space-x-4 text-xs text-gray-500">
                      <span>Products</span>
                      <span>Use cases</span>
                      <span>Resources</span>
                      <span>Company</span>
                      <span>Pricing</span>
                    </div>
                  </div>
                  <div className="h-40 flex items-end justify-center space-x-6 border-b border-gray-200 pb-2">
                    <div className="w-8 bg-[#8ba4a1]/40 h-1/3"></div>
                    <div className="w-8 bg-[#8ba4a1] h-full"></div>
                    <div className="w-8 bg-[#8ba4a1]/70 h-2/3"></div>
                    <div className="w-8 bg-[#8ba4a1]/40 h-1/4"></div>
                    <div className="w-24 h-12 bg-[#8ba4a1]/20 rounded-full flex items-center justify-center text-[#8ba4a1] font-semibold text-sm ml-8">TRY FOR FREE</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Panel: Comments */}
          <div className="w-full lg:w-96 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-[600px]">
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
    </div>
  );
}
