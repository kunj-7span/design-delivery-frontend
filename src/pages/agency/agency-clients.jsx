import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import Pagination from "../../components/agency/pagination";
import { Pencil, Trash2 } from "lucide-react";

const data = [
  {
    name: "Velvet Design",
    email: "marcus.reid@velvet.design",
    date: "Oct 24, 2023",
    status: "Pending",
  },
  {
    name: "TechFlow",
    email: "sarah.j@techflow.io",
    date: "Oct 22, 2023",
    status: "Cancelled",
  },
  {
    name: "Nova Agency",
    email: "hello@nova.com",
    date: "Oct 20, 2023",
    status: "Pending",
  },
  {
    name: "PixelCraft",
    email: "team@pixel.com",
    date: "Oct 18, 2023",
    status: "Pending",
  },
  {
    name: "DevStudio",
    email: "info@devstudio.com",
    date: "Oct 15, 2023",
    status: "Cancelled",
  },
  {
    name: "AlphaTech",
    email: "contact@alpha.com",
    date: "Oct 10, 2023",
    status: "Pending",
  },
];

const ITEMS_PER_PAGE = 3;

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AgencyClients = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="p-4 md:p-6 min-h-screen">
        <h2 className="text-heading">Client Invitations & Directory</h2>
        
        <div className="mt-5 bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="">
            <div className="flex items-center gap-3">
              <UserPlus
                size={40}
                className="text-white bg-primary rounded-full p-2"
              />
              <h2 className="text-subheading font-semibold text-gray-800">
                Invite New Client
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-gray-400">
              Send a secure link to your client to grant them access to project
              dashboards and asset delivery.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="mb-3 text-subheading font-semibold text-gray-800">
            Pending Invitations
          </h2>

          <div className="w-full overflow-auto rounded-xl border border-gray-200 shadow-sm">
            <div className="min-w-175 md:min-w-full overflow-x-auto">
              <table className="w-full min-w-200 md:min-w-full text-left table-auto">
                {/* Header */}
                <thead className="bg-gray-100 text-gray-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3">Client Name</th>
                    <th className="px-6 py-3">Client Email</th>
                    <th className="px-6 py-3">Date Sent</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-300">
                  {currentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 bg-white">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.email}</td>
                      <td className="px-6 py-4 text-gray-600">{item.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                            item.status,
                          )}`}
                        >
                          • {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-4 text-gray-500">
                        <button className="hover:text-blue-600">
                          <Pencil size={16} />
                        </button>
                        <button className="hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  if (page < 1 || page > totalPages) return;
                  setCurrentPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyClients;
