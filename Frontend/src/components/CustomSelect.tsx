"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#192429] text-white border border-[#253238] text-sm focus:outline-none focus:border-[#33FDFF] transition-colors flex items-center justify-between cursor-pointer select-none text-left"
      >
        <span className={selectedOption ? "text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#33FDFF]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu constrained within parent and never overflows the mobile screen */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#121c21] border border-[#26354A] shadow-2xl rounded-none z-50 max-h-60 overflow-y-auto divide-y divide-[#1e2d34] backdrop-blur-md">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#33FDFF]/15 text-[#33FDFF] font-semibold"
                    : "text-slate-200 hover:bg-[#192429] hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} className="text-[#33FDFF]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

