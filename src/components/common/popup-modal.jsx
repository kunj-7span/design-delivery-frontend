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
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5">
        <div className="flex flex-row-reverse justify-between items-center">
          {/* Close Button */}
          <button onClick={onClose} className="top-3 right-3 text-gray-500">
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            onClose();
            reset();
          })}
          className="mt-4 flex flex-col gap-3"
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
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Error */}
              {errors[field.name] && (
                <p className="text-red-500 text-xs">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-xl mt-2 shadow-md shadow-indigo-200"
          >
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
