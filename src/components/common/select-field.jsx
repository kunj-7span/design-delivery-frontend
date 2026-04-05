import React from "react";
import { ChevronDown } from "lucide-react";

const SelectField = React.forwardRef(
  (
    { label, id, options = [], error, placeholder = "Select...", ...props },
    ref,
  ) => {
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
        <div
          className={`relative flex items-center rounded-xl border transition-colors bg-white ${
            error
              ? "border-red-500"
              : "border-gray-300 focus-within:border-primary"
          }`}
        >
          <select
            id={id}
            ref={ref}
            className="w-full p-2 sm:p-3 rounded-xl focus:outline-none text-sm bg-transparent appearance-none cursor-pointer pr-8 text-gray-400"
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 text-gray-400 pointer-events-none"
          />
        </div>
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

SelectField.displayName = "SelectField";
export default SelectField;
