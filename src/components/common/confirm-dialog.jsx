import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  icon = null,
  iconBgColor = "bg-red-100",
  iconColor = "text-red-600",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  confirmButtonColor = "bg-red-600 hover:bg-red-700",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${iconBgColor} rounded-full p-4`}>
            {icon || <AlertTriangle size={28} className={iconColor} />}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
          {title}
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-8 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white px-8 py-2 rounded-lg font-medium shadow-md transition`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
