import React, { useState, useCallback } from "react";
import { Check, X, AlertCircle } from "lucide-react";

const Toast = ({ id, message, type = "success", onClose }) => {
  const typeStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-800",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
    },
  };

  const styles = typeStyles[type] || typeStyles.success;

  const Icon = type === "success" ? Check : type === "error" ? X : AlertCircle;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${styles.bg} ${styles.border} animate-slide-in`}
    >
      <Icon size={20} className={styles.icon} />
      <span className={`text-sm font-medium ${styles.text}`}>{message}</span>
      <button
        onClick={() => onClose(id)}
        className={`ml-auto ${styles.icon} hover:opacity-70`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};
