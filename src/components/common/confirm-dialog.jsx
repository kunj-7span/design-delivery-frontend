import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 rounded-full p-2">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <button
            onClick={onCancel}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-200 rounded-lg font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
