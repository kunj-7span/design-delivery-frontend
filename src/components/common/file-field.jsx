import React from "react";

const FileField = React.forwardRef(
  ({ label, error, id, labelClassName, ...props }, ref) => {
    return (
      <div className="w-full h-20">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm tracking-wider font-semibold mb-2 block ${labelClassName || ""} ${error ? "text-red-500" : "text-gray-500"}`}
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border transition-colors bg-white ${error ? "border-red-500" : "border-gray-300 focus-within:border-primary"}`}
        >
          <input
            id={id}
            ref={ref}
            type="file"
            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-primary file:text-xs file:font-semibold hover:file:bg-indigo-100 cursor-pointer outline-none transition-colors"
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="text-red-500 text-[10px] mt-1 text-end"
            role="alert"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

FileField.displayName = "FileField";

export default FileField;
