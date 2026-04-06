import React, { useState } from "react";
import { Mail, Phone, Folder, Trash2 } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";

const ClientCard = ({
  companyName,
  pointOfContact,
  email,
  phone,
  activeProjects,
  status = "Active",
  initials,
  onDelete,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setDeleteConfirm(false);
    if (onDelete) {
      onDelete(companyName);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
        {/* Header with initials and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{initials}</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              status,
            )} flex items-center gap-1`}
          >
            <span className="w-2 h-2 bg-current rounded-full"></span>
            {status}
          </span>
        </div>

        {/* Company Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{companyName}</h3>

        {/* Point of Contact */}
        <p className="text-sm text-gray-400 mb-4">
          Point of Contact: {pointOfContact}
        </p>

        {/* Email */}
        <div className="flex items-center gap-3 mb-3">
          <Mail size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 mb-3">
          <Phone size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{phone}</span>
        </div>

        {/* Active Projects */}
        <div className="flex items-center gap-3 mb-6">
          <Folder size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {activeProjects} Active Projects
          </span>
        </div>

        {/* Delete Button
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg transition font-medium text-sm"
          >
            <Trash2 size={16} />
            Delete Client
          </button>
        )} */}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        title="Delete Client"
        message={`Are you sure you want to delete ${companyName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ClientCard;
