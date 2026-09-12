import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import type { LanguageId } from "../../types/api";
import { SUPPORTED_LANGUAGES } from "../../lib/constants";
import { LanguageTrackIcon } from "../../lib/icons";

interface CourseSelectorProps {
  currentLanguage: LanguageId;
  onSelectLanguage: (language: LanguageId) => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.csharp;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languageList = Object.keys(SUPPORTED_LANGUAGES) as LanguageId[];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all font-bold text-slate-800 dark:text-slate-100 shadow-xs active:scale-98 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
        aria-label="Select Programming Language"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-mono text-xs font-bold shrink-0">
          <LanguageTrackIcon languageId={activeLang.id} className="w-3.5 h-3.5" />
        </span>
        <span className="text-sm font-semibold tracking-tight truncate max-w-[100px] sm:max-w-none">
          {activeLang.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[440px] overflow-y-auto">
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Programming Tracks
            </span>
            <span className="font-bold flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
              <Globe className="w-3 h-3" />
              {languageList.length} Tracks
            </span>
          </div>

          <div className="py-1">
            {languageList.map((langId) => {
              const lang = SUPPORTED_LANGUAGES[langId];
              const isSelected = langId === currentLanguage;
              return (
                <button
                  key={langId}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(langId);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-black transition-transform shrink-0 ${
                      isSelected
                        ? "bg-red-600 text-white shadow-xs scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <LanguageTrackIcon languageId={langId} className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold leading-snug">{lang.label}</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {lang.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lang.description}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
