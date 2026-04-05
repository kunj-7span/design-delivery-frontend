import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "../common/confirm-dialog";

const EmployeeTable = ({ data = [], onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    item: null,
  });

  const handleDeleteClick = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.item && onDelete) {
      onDelete(deleteConfirm.item);
    }
    setDeleteConfirm({ isOpen: false, item: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, item: null });
  };

  // Generate avatar with initials
  const getAvatarInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Generate avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirm.item?.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Employee</th>
              <th className="px-6 py-3 whitespace-nowrap">Email</th>
              <th className="px-6 py-3 whitespace-nowrap">Active Projects</th>
              <th className="px-6 py-3 text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 bg-white">
                {/* Employee with Avatar and Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getAvatarColor(
                        item.name,
                      )}`}
                    >
                      {getAvatarInitials(item.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-600">{item.email}</td>

                {/* Active Projects */}
                <td className="px-6 py-4 text-gray-600">
                  <span className="text-xs bg-gray-200 rounded-xl p-2">{item.activeProjects || "0"} Projects</span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 flex justify-center gap-4 text-gray-500">
                  {onDelete && (
                    <button onClick={() => handleDeleteClick(item)}>
                      <Trash2
                        size={16}
                        className="cursor-pointer hover:text-red-600"
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="sm:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-white rounded-lg p-4 shadow-sm space-y-3"
          >
            {/* Employee Info with Avatar */}
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${getAvatarColor(
                  item.name,
                )}`}
              >
                {getAvatarInitials(item.name)}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs">Email</span>
              <span className="text-gray-800 text-sm font-medium text-right">
                {item.email}
              </span>
            </div>

            {/* Active Projects */}
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs">Active Projects</span>
              <span className="text-gray-800 text-sm font-medium">
                {item.activeProjects || "0"} Projects
              </span>
            </div>

            {/* Actions */}
            {onDelete && (
              <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => handleDeleteClick(item)}>
                  <Trash2
                    size={16}
                    className="cursor-pointer hover:text-red-600 text-gray-500"
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeTable;
