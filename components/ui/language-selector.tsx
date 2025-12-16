"use client";

import { useState } from "react";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/language-service";

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  className?: string;
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange, 
  className = "" 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <span className="text-sm font-medium">
          {SUPPORTED_LANGUAGES[selectedLanguage]}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageChange(code as LanguageCode);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                selectedLanguage === code ? 'bg-purple-50 text-purple-700' : ''
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}