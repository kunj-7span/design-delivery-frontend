import React, { useState } from "react";
import { Pencil, Trash2, Send } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";

const Table = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onSend,
  renderActions = true,
  statusStyles = {},
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    item: null,
  });

  const defaultStatusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-600",
    active: "bg-green-100 text-green-700",
    ...statusStyles,
  };

  const getStatusStyle = (status) => {
  if (!status) return "bg-gray-100 text-gray-600"; // Fallback
  return (
    defaultStatusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-600"
  );
};

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

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-175 text-left table-auto">
          <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
              {renderActions && (
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 bg-white">
                {columns.map((column) => (
                  <td
                    key={`${item.id || index}-${column.key}`}
                    className="px-6 py-4 text-gray-600 whitespace-nowrap"
                  >
                    {column.key === "status" ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          item[column.key],
                        )}`}
                      >
                        • {item[column.key]}
                      </span>
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-6 py-4 flex justify-center gap-4 text-gray-500">
                    {onEdit && (
                      <button onClick={() => onEdit(item)}>
                        <Pencil size={16} className="cursor-pointer hover:text-primary"/>
                      </button>
                    )}
                    {onSend && (
                      <button onClick={() => onSend(item)}>
                        <Send size={16} className="cursor-pointer hover:text-green-600"/>
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => handleDeleteClick(item)}>
                        <Trash2 size={16} className="cursor-pointer hover:text-red-600"/>
                      </button>
                    )}
                  </td>
                )}
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
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex justify-between items-start py-1"
              >
                <span className="text-gray-400 text-xs">{column.label}</span>

                <span className="text-gray-800 text-sm font-medium text-right">
                  {column.key === "status" ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                        item[column.key],
                      )}`}
                    >
                      {item[column.key]}
                    </span>
                  ) : column.render ? (
                    column.render(item[column.key], item)
                  ) : (
                    item[column.key]
                  )}
                </span>
              </div>
            ))}

            {/* Actions */}
            {renderActions && (
              <div className="flex justify-end gap-4 mt-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {onSend && (
                      <button onClick={() => onSend(item)}>
                        <Send size={16} className="text-green-600"/>
                      </button>
                    )}
                {onDelete && (
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default Table;
