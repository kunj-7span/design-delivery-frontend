import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchInput = ({
  value = "",
  onDebouncedChange,
  onChange,
  delay = 1000,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onDebouncedChange) {
        onDebouncedChange(inputValue);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [inputValue, delay, onDebouncedChange]);

  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
      />
      <input
        type="text"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-white py-2 pl-11 pr-4 text-sm text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-primary ${inputClassName}`}
      />
    </div>
  );
};

export default SearchInput;
