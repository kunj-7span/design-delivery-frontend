import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormModal = ({
  isOpen,
  onClose,
  title,
  fields = [],
  defaultValues = {},
  onSubmit,
  submitText = "Submit",
  schema,
  children,
  renderContent,
  maxWidth = "max-w-md",
  hideSubmit = false,
  showCancelButton = false,
  cancelText = "Cancel",
  submitClassName = "",
  contentClassName = "",
  titleClassName = "",
  resetOnClose = true,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  // Prefill values (important)
  useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, isOpen, reset]);

  if (!isOpen) return null;

  const content =
    typeof renderContent === "function"
      ? renderContent({ register, errors, reset })
      : children;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-white w-full ${maxWidth} rounded-xl shadow-lg p-5`}>
        <div className="flex flex-row-reverse justify-between items-center">
          {/* Close Button */}
          <button onClick={onClose} className="top-3 right-3 text-gray-500">
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>
            {title}
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              onSubmit(data);
            }
            onClose();
            if (resetOnClose) {
              reset(defaultValues || {});
            }
          })}
          className={`mt-4 flex flex-col gap-3 ${contentClassName}`}
        >
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              {/* Label */}
              <label htmlFor={field.name} className="text-sm text-gray-400">
                {field.label}
              </label>

              {/* Input */}
              <input
                id={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                {...register(field.name)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />

              {/* Error */}
              {errors[field.name] && (
                <p className="text-red-500 text-xs">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          {content}

          {/* Submit */}
          {(!hideSubmit || showCancelButton) && (
            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {showCancelButton && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (resetOnClose) {
                      reset(defaultValues || {});
                    }
                  }}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
                >
                  {cancelText}
                </button>
              )}

              {!hideSubmit && (
                <button
                  type="submit"
                  className={`bg-primary text-white py-2 px-5 rounded-xl shadow-md shadow-indigo-200 ${submitClassName}`}
                >
                  {submitText}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormModal;
