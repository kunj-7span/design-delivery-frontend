import React, { useState } from "react";
import { X } from "lucide-react";

const TagInput = ({
  label,
  id,
  tags = [],
  onAddTag,
  onRemoveTag,
  placeholder = "Search and add...",
  error,
  tagColor = "bg-primary",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemoveTag(tags.length - 1);
    }
  };

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
        className={`flex items-center flex-wrap gap-2 p-2 sm:p-3 rounded-xl border transition-colors bg-white ${
          error
            ? "border-red-500"
            : "border-gray-300 focus-within:border-primary"
        }`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${tagColor} text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-30 focus:outline-none placeholder:text-gray-400 text-sm bg-transparent"
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
};

export default TagInput;
