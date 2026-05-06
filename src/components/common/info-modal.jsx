import React, { useEffect } from "react";
import { X } from "lucide-react";

const InfoModal = ({
  isOpen,
  onClose,
  title = "Details",
  items = [],
  maxWidth = "max-w-2xl",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className={`mx-4 w-full rounded-xl bg-white p-5 shadow-lg ${maxWidth}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className={`rounded-lg border border-gray-200 p-3 ${item.fullWidth ? "md:col-span-2" : ""}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {item.label}
              </p>
              <div className="mt-1 text-sm text-gray-700">
                {item.isLink && item.value ? (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline break-all"
                  >
                    {item.linkText || item.value}
                  </a>
                ) : (
                  <span>{item.value || "-"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
