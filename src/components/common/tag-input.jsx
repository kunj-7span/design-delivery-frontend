import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const TagInput = ({
  label,
  id,
  tags = [],
  onAddTag,
  onRemoveTag,
  placeholder = "Search and add...",
  error,
  tagColor = "bg-primary",
  options = [],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isObjectMode = options.length > 0;

  // Filter options: not already selected, matches search
  const filteredOptions = options.filter((opt) => {
    const alreadySelected = tags.some((t) =>
      typeof t === "object" ? t.id === opt.id : t === opt.id,
    );
    const matchesSearch = opt.name
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    return !alreadySelected && matchesSearch;
  });

  const handleKeyDown = (e) => {
    if (!isObjectMode) {
      // Legacy plain-string mode
      if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
        e.preventDefault();
        onAddTag(inputValue.trim());
        setInputValue("");
      }
      if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        onRemoveTag(tags.length - 1);
      }
    } else {
      if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        onRemoveTag(tags.length - 1);
      }
    }
  };

  const handleSelectOption = (opt) => {
    onAddTag(opt);
    setInputValue("");
    setIsOpen(false);
  };

  const getDisplayName = (tag) => {
    if (typeof tag === "object" && tag.name) return tag.name;
    return tag;
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm tracking-wider font-semibold mb-2 block ${error ? "text-red-500" : "text-gray-500"
            }`}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center flex-wrap gap-2 p-2 sm:p-3 rounded-xl border transition-colors bg-white cursor-text ${error
            ? "border-red-500"
            : "border-gray-300 focus-within:border-primary"
          }`}
        onClick={() => {
          document.getElementById(id)?.focus();
          if (isObjectMode) setIsOpen(true);
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={typeof tag === "object" ? tag.id : index}
            className={`${tagColor} text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap`}
          >
            {getDisplayName(tag)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(index);
              }}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
              aria-label={`Remove ${getDisplayName(tag)}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-30 flex items-center">
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (isObjectMode) setIsOpen(true);
            }}
            onFocus={() => {
              if (isObjectMode) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 focus:outline-none placeholder:text-gray-400 text-sm bg-transparent"
          />
          {isObjectMode && (
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isObjectMode && isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
              >
                {opt.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No options available
            </div>
          )}
        </div>
      )}

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
};

export default TagInput;
