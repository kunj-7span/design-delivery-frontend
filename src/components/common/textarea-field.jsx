import React from "react";

const TextareaField = React.forwardRef(
  ({ label, id, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm tracking-wider mb-2 block ${
              error ? "text-red-500" : "text-gray-400"
            }`}
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={`w-full p-2 sm:p-3 rounded-xl border transition-colors bg-white focus:outline-none text-sm resize-none placeholder:text-gray-400 ${
            error ? "border-red-500" : "border-gray-300 focus:border-primary"
          }`}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="text-red-500 text-xs mt-1"
            role="alert"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

TextareaField.displayName = "TextareaField";
export default TextareaField;
