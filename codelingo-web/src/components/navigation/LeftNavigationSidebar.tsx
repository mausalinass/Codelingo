import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Code2,
  Globe,
  Calculator,
  Compass,
  Trophy,
  Target,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  Zap,
} from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  CODING_LANGUAGES,
  SPOKEN_LANGUAGES,
  MATH_TRACKS,
} from "../../lib/constants";
import { LanguageTrackIcon } from "../../lib/icons";
import { ThemeToggle } from "./ThemeToggle";
import type { DashboardResponse, LanguageId, SubjectCategory } from "../../types/api";

interface LeftNavigationSidebarProps {
  currentLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  dashboard?: DashboardResponse;
}

export const LeftNavigationSidebar: React.FC<LeftNavigationSidebarProps> = ({
  currentLanguage,
  onSelectLanguage,
  dashboard,
}) => {
  const location = useLocation();
  const activeLang = SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.csharp;
  const activeSubject: SubjectCategory = activeLang.subject || "coding";

  // Control open/close of each subject's track accordion
  const [expandedSubject, setExpandedSubject] = useState<SubjectCategory | null>(activeSubject);

  // Remembers the last selected track per subject category
  const [lastSelectedTracks, setLastSelectedTracks] = useState<Record<SubjectCategory, LanguageId>>({
    coding: (CODING_LANGUAGES as readonly LanguageId[]).includes(currentLanguage) ? currentLanguage : "csharp",
    language: (SPOKEN_LANGUAGES as readonly LanguageId[]).includes(currentLanguage) ? currentLanguage : "spanish",
    math: (MATH_TRACKS as readonly LanguageId[]).includes(currentLanguage) ? currentLanguage : "math_basics",
  });

  const handleSubjectTabClick = (subject: SubjectCategory) => {
    // If clicking the currently active subject, toggle accordion
    if (activeSubject === subject) {
      setExpandedSubject((prev) => (prev === subject ? null : subject));
      return;
    }

    // Switch to this subject's remembered track
    const targetTrack = lastSelectedTracks[subject];
    setExpandedSubject(subject);
    onSelectLanguage(targetTrack);
  };

  const handleSelectTrack = (trackId: LanguageId, subject: SubjectCategory) => {
    setLastSelectedTracks((prev) => ({
      ...prev,
      [subject]: trackId,
    }));
    onSelectLanguage(trackId);
  };

  const subjects: Array<{
    id: SubjectCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count: string;
    tracks: LanguageId[];
    activeColor: string;
    pillColor: string;
    accentIconColor: string;
  }> = [
    {
      id: "coding",
      label: "Coding",
      icon: Code2,
      count: `${CODING_LANGUAGES.length} Tracks`,
      tracks: CODING_LANGUAGES,
      activeColor: "border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
      pillColor: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
      accentIconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "language",
      label: "Languages",
      icon: Globe,
      count: `${SPOKEN_LANGUAGES.length} Languages`,
      tracks: SPOKEN_LANGUAGES,
      activeColor: "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
      pillColor: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
      accentIconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "math",
      label: "Math",
      icon: Calculator,
      count: `${MATH_TRACKS.length} Tracks`,
      tracks: MATH_TRACKS,
      activeColor: "border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
      pillColor: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
      accentIconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <>
      {/* Desktop / Tablet Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 z-30 transition-colors">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            to="/learn"
            className="flex items-center gap-2.5 group focus:outline-hidden"
            title="Codelingo"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-red-500/20 shadow-xs group-hover:shadow-md group-hover:shadow-red-500/30 group-hover:scale-105 transition-all bg-[#12bba8] shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Codelingo Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Code<span className="text-red-600">lingo</span>
              </span>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Learn Any Subject
              </div>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 flex flex-col gap-6 custom-scrollbar">
          {/* SECTION 1: PRIMARY SUBJECT TABS (Coding, Languages, Math) */}
          <div className="flex flex-col gap-1.5">
            <div className="px-2 pb-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Subjects
            </div>

            {subjects.map((sub) => {
              const isActive = activeSubject === sub.id;
              const isExpanded = expandedSubject === sub.id;
              const SubIcon = sub.icon;

              return (
                <div key={sub.id} className="flex flex-col">
                  {/* Subject Tab Button */}
                  <button
                    type="button"
                    onClick={() => handleSubjectTabClick(sub.id)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left font-bold transition-all cursor-pointer border ${
                      isActive
                        ? `${sub.activeColor} border-l-4 shadow-xs`
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-white dark:bg-slate-800 shadow-2xs"
                            : "bg-slate-100 dark:bg-slate-800/80 group-hover:bg-white dark:group-hover:bg-slate-750"
                        }`}
                      >
                        <SubIcon className={`w-4 h-4 ${sub.accentIconColor}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight leading-snug">
                          {sub.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {sub.count}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${sub.pillColor}`}
                        >
                          ACTIVE
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Sub-Track Drawer (Visible when expanded) */}
                  {isExpanded && (
                    <div className="ml-5 pl-3 mt-1 mb-2 border-l-2 border-slate-200 dark:border-slate-800 flex flex-col gap-1 animate-in fade-in duration-150">
                      {sub.tracks.map((tId) => {
                        const track = SUPPORTED_LANGUAGES[tId];
                        const isCurrentTrack = tId === currentLanguage;

                        return (
                          <button
                            key={tId}
                            type="button"
                            onClick={() => handleSelectTrack(tId, sub.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrentTrack
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="shrink-0">
                                <LanguageTrackIcon languageId={tId} className="w-3.5 h-3.5" />
                              </span>
                              <span className="truncate">{track.label}</span>
                            </div>
                            {isCurrentTrack && (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-red-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SECTION 2: LEARNING MENU */}
          <div className="flex flex-col gap-1">
            <div className="px-2 pb-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Menu
            </div>

            <Link
              to="/learn"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors ${
                location.pathname === "/learn"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/50 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Compass className="w-4 h-4 text-red-500" />
              <span>Learn Path</span>
            </Link>

            <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-default select-none">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Leaderboard</span>
              </div>
              <span className="text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md">
                #4
              </span>
            </div>

            <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-default select-none">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-emerald-500" />
                <span>Daily Quests</span>
              </div>
              <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                2/3
              </span>
            </div>
          </div>

          {/* SECTION 3: SWELL PERSONALITY SUMMARY */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-850 dark:to-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Louis AI Coach</span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-snug">
              Adaptive pacing tuned to your current learning mode.
            </p>
          </div>
        </div>

        {/* Footer: User profile snippet & theme toggle */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {(dashboard?.user.displayName || "Alex").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {dashboard?.user.displayName || "Alex"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {dashboard?.user.totalXp ?? 120} XP
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Top Tab Bar (Shown only on small screens < md) */}
      <div className="md:hidden sticky top-16 z-20 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 shadow-xs transition-colors">
        <div className="grid grid-cols-3 gap-2">
          {subjects.map((sub) => {
            const isActive = activeSubject === sub.id;
            const SubIcon = sub.icon;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubjectTabClick(sub.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isActive
                    ? `${sub.activeColor} shadow-xs`
                    : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850"
                }`}
              >
                <SubIcon className={`w-3.5 h-3.5 ${sub.accentIconColor}`} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
