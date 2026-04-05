import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = React.forwardRef(
  (
    { label, icon: Icon, error, type = "text", id, labelClassName, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full h-20">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm tracking-wider mb-2 block ${labelClassName || ""} ${error ? "text-red-500" : "text-gray-400"}`}
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border transition-colors bg-white ${error ? "border-red-500" : "border-gray-300 focus-within:border-primary"}`}
        >
          {Icon && (
            <Icon
              size={18}
              className={error ? "text-red-500" : "text-gray-400"}
            />
          )}

          <input
            id={id}
            ref={ref}
            type={inputType}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full focus:outline-none placeholder:text-gray-400 text-sm bg-transparent ${type === "date" ? "text-gray-400" : ""}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="text-red-500 text-xs mt-1 text-end"
            role="alert"
          >
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
export default InputField;
