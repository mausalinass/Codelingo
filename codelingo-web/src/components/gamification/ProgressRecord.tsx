import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Award,
  BarChart3,
  Sparkles,
  Maximize2,
  Minimize2,
  Code2,
  Globe,
  Calculator,
  ChevronDown,
} from "lucide-react";
import type { DashboardResponse, LanguageId, SubjectCategory } from "../../types/api";
import {
  SUPPORTED_LANGUAGES,
  CODING_LANGUAGES,
  SPOKEN_LANGUAGES,
  MATH_TRACKS,
} from "../../lib/constants";
import { LanguageTrackIcon } from "../../lib/icons";

/**
 * Progression Color System
 * Gradually shifts from crimson red (0-20%) -> warm orange (30-40%) ->
 * golden amber (50-60%) -> lime (70-80%) -> lush emerald green (90-100%).
 */
const getProgressColor = (percent: number): string => {
  if (percent >= 80) return "#10b981"; // Emerald Green
  if (percent >= 60) return "#84cc16"; // Lime Green
  if (percent >= 40) return "#f59e0b"; // Warm Amber
  if (percent >= 20) return "#f97316"; // Orange
  return "#ef4444"; // Crimson Red
};

const getProgressGradient = (percent: number): string => {
  if (percent >= 80) {
    return "linear-gradient(90deg, #f59e0b 0%, #84cc16 45%, #10b981 100%)";
  }
  if (percent >= 60) {
    return "linear-gradient(90deg, #f97316 0%, #f59e0b 45%, #84cc16 100%)";
  }
  if (percent >= 40) {
    return "linear-gradient(90deg, #ef4444 0%, #f97316 45%, #f59e0b 100%)";
  }
  if (percent >= 20) {
    return "linear-gradient(90deg, #ef4444 0%, #f97316 100%)";
  }
  return "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
};

const getProgressBadgeStyle = (
  percent: number
): { bg: string; text: string; border: string } => {
  if (percent >= 80) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-800",
    };
  }
  if (percent >= 60) {
    return {
      bg: "bg-lime-50 dark:bg-lime-950/40",
      text: "text-lime-700 dark:text-lime-400",
      border: "border-lime-300 dark:border-lime-800",
    };
  }
  if (percent >= 40) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-300 dark:border-amber-800",
    };
  }
  if (percent >= 20) {
    return {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-300 dark:border-orange-800",
    };
  }
  return {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-800",
  };
};

const getProgressTierLabel = (percent: number): string => {
  if (percent >= 100) return "Mastered";
  if (percent >= 80) return "Advanced";
  if (percent >= 60) return "Proficient";
  if (percent >= 40) return "Intermediate";
  if (percent >= 20) return "Apprentice";
  return "Novice";
};

interface ProgressRecordProps {
  dashboard?: DashboardResponse;
  currentLanguage: LanguageId;
  onSelectLanguage?: (lang: LanguageId) => void;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  variant?: "sidebar" | "compact";
}

export const ProgressRecord: React.FC<ProgressRecordProps> = ({
  dashboard,
  currentLanguage,
  onSelectLanguage,
  defaultExpanded = true,
  isExpanded: controlledExpanded,
  onToggleExpand,
  variant = "sidebar",
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const activeSubject: SubjectCategory =
    SUPPORTED_LANGUAGES[currentLanguage]?.subject || "coding";
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<SubjectCategory | null>(null);
  const activeTab: SubjectCategory = selectedSubjectTab ?? activeSubject;
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const currentStreak = dashboard?.streak.current ?? 4;
  const longestStreak = dashboard?.streak.longest ?? 7;
  const totalXp = dashboard?.user.totalXp ?? 120;
  const userName = dashboard?.user.displayName ?? "Alex";

  // Calculate overall stats across tracks
  const totalCourses = dashboard?.courses.length ?? 8;
  const completedLessonsTotal =
    dashboard?.courses.reduce((acc, c) => acc + c.completedLessons, 0) ?? 1;
  const totalPossibleLessons = totalCourses * 10;
  const overallPercentage = Math.round(
    (completedLessonsTotal / Math.max(1, totalPossibleLessons)) * 100
  );

  // Active track stats
  const activeCourse = dashboard?.courses.find((c) => c.language === currentLanguage);
  const activeCompleted = activeCourse?.completedLessons ?? 1;
  const activePercent = activeCourse?.percentage ?? 10;
  const activeLangMeta = SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.csharp;

  const badgeStyle = getProgressBadgeStyle(activePercent);
  const tierLabel = getProgressTierLabel(activePercent);

  const milestones = [
    {
      title: "First Steps",
      desc: "Completed your first lesson",
      unlocked: completedLessonsTotal >= 1,
      icon: CheckCircle2,
      color:
        "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Flame Keeper",
      desc: "Maintained a 4+ day streak",
      unlocked: currentStreak >= 4,
      icon: Flame,
      color:
        "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    },
    {
      title: "Centurion XP",
      desc: "Earned over 100 XP points",
      unlocked: totalXp >= 100,
      icon: Zap,
      color:
        "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Polyglot Coder",
      desc: "Explored multiple programming tracks",
      unlocked: totalCourses >= 3,
      icon: Trophy,
      color:
        "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-600",
    },
  ];

  // Compact Ribbon Variant (used when the progress panel is reduced)
  if (variant === "compact") {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-6 py-3 transition-all flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-4">
        {/* Left: User Progress & Live badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {userName}'s Progress
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-200 dark:border-red-900/60">
                <Sparkles className="w-2.5 h-2.5" /> Live
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {completedLessonsTotal} of {totalPossibleLessons} completed ({overallPercentage}%)
            </span>
          </div>
        </div>

        {/* Center: KPI mini pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{currentStreak}d streak</span>
          </div>

          {/* XP pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{totalXp} XP</span>
          </div>

          {/* Active Track Mastery Pill with Red-to-Green mini meter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <LanguageTrackIcon languageId={currentLanguage} className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-200">{activeLangMeta.label}</span>
            <div className="w-16 sm:w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(10, activePercent)}%`,
                  background: getProgressGradient(activePercent),
                }}
              />
            </div>
            <span
              className="font-black text-[11px]"
              style={{ color: getProgressColor(activePercent) }}
            >
              {activePercent}%
            </span>
          </div>

          {/* Tier badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {tierLabel}
          </span>
        </div>

        {/* Right: Expand Full Progress Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-black transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98] shrink-0 ml-auto md:ml-0"
          title="Expand full progress panel"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Expand Progress</span>
          <Maximize2 className="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Header Bar: Click to Expand / Collapse */}
      <div className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-3 text-left cursor-pointer focus:outline-hidden group"
          aria-expanded={isExpanded}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {userName}'s Progress
              </h3>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full border border-red-200 dark:border-red-900/60">
                <Sparkles className="w-2.5 h-2.5" /> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {completedLessonsTotal} completed • {currentStreak} day streak
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {activePercent}%
          </span>
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Reduce progress panel to expand lesson panel"
          >
            <span className="hidden sm:inline">Reduce</span>
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main KPI Stats Bar */}
      <div className="px-4 sm:px-5 pb-4 pt-1 grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-800">
        {/* Streak */}
        <div className="p-2.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 mb-0.5">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-orange-700 dark:text-orange-400">
            {currentStreak} <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">days</span>
          </span>
          <span className="text-[9px] text-orange-500/90 dark:text-orange-400/80 font-semibold mt-0.5 truncate">
            Best: {longestStreak}d
          </span>
        </div>

        {/* Total XP */}
        <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total XP</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400">
            {totalXp}
          </span>
          <span className="text-[9px] text-amber-500/90 dark:text-amber-400/80 font-semibold mt-0.5 truncate">
            Points
          </span>
        </div>

        {/* Mastery with Dynamic Red-to-Green Mini Bar */}
        <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center shadow-2xs">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 mb-0.5">
            <CheckCircle2
              className="w-3.5 h-3.5"
              style={{ color: getProgressColor(activePercent) }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mastery</span>
          </div>
          <span
            className="text-lg sm:text-xl font-black transition-colors"
            style={{ color: getProgressColor(activePercent) }}
          >
            {activeCompleted}/10
          </span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1 border border-slate-200/60 dark:border-slate-600/60">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(10, activePercent)}%`,
                background: getProgressGradient(activePercent),
              }}
            />
          </div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Expandable Detailed Record Breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-5 py-4 flex flex-col gap-5 bg-slate-50/50 dark:bg-slate-950/40"
          >
            {/* Active Track Detailed Progress Bar: Transitions Red -> Green */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between gap-2 text-xs font-bold mb-2">
                <span className="text-slate-800 dark:text-slate-100 font-extrabold truncate">
                  {activeLangMeta.label} Track Progress
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} shrink-0`}
                >
                  {activeCompleted} of 10 ({activePercent}%)
                </span>
              </div>

              {/* Dynamic Red-to-Green Progress Bar */}
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-600 relative shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-xs relative"
                  style={{
                    width: `${Math.max(8, activePercent)}%`,
                    background: getProgressGradient(activePercent),
                    boxShadow: `0 0 10px ${getProgressColor(activePercent)}55`,
                  }}
                >
                  {/* Subtle top shine */}
                  <div className="w-full h-1 bg-white/35 rounded-full" />
                </div>
              </div>

              {/* Red-to-Green Progression Legend */}
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 px-1">
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Novice (Red)
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Mid (Amber)
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Master (Green)
                </span>
              </div>
            </div>

            {/* Milestones / Achievements Collapsible Dropdown */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsMilestonesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs group select-none"
                aria-expanded={isMilestonesOpen}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Award className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Earned Milestones
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {milestones.filter((m) => m.unlocked).length} of {milestones.length} achievements unlocked
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                    {milestones.filter((m) => m.unlocked).length}/{milestones.length}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isMilestonesOpen ? "rotate-180 text-slate-700 dark:text-slate-200" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isMilestonesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2.5 flex flex-col gap-2">
                      {milestones.map((m, idx) => {
                        const Icon = m.icon;
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                              m.unlocked
                                ? `${m.color} shadow-2xs`
                                : "bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 text-slate-400 dark:text-slate-500 opacity-60"
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-black leading-tight truncate">
                                {m.title}
                              </div>
                              <div className="text-[10px] font-medium opacity-90 dark:opacity-95 leading-snug truncate">
                                {m.desc}
                              </div>
                            </div>
                            {m.unlocked && (
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-current" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Programming Languages & Curriculum Tracks Collapsible Dropdown */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsTracksOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs group select-none"
                aria-expanded={isTracksOpen}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <BarChart3 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Programming Languages & Tracks
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {activeLangMeta.label} active • {overallPercentage}% Overall
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
                    {CODING_LANGUAGES.length + SPOKEN_LANGUAGES.length + MATH_TRACKS.length} Tracks
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isTracksOpen ? "rotate-180 text-slate-700 dark:text-slate-200" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isTracksOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 flex flex-col gap-3">
                      {/* 3 Subject Tabs: Matching Left Navigation Sidebar */}
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                {(
                  [
                    {
                      id: "coding" as SubjectCategory,
                      label: "Coding",
                      icon: Code2,
                      iconColor: "text-blue-500",
                      activeStyle:
                        "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600 shadow-xs",
                      tracks: CODING_LANGUAGES,
                    },
                    {
                      id: "language" as SubjectCategory,
                      label: "Languages",
                      icon: Globe,
                      iconColor: "text-emerald-500",
                      activeStyle:
                        "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 shadow-xs",
                      tracks: SPOKEN_LANGUAGES,
                    },
                    {
                      id: "math" as SubjectCategory,
                      label: "Math",
                      icon: Calculator,
                      iconColor: "text-amber-500",
                      activeStyle:
                        "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 shadow-xs",
                      tracks: MATH_TRACKS,
                    },
                  ] as const
                ).map((tab) => {
                  const isTabActive = activeTab === tab.id;
                  const TabIcon = tab.icon;

                  // Calculate category-specific completed lessons
                  let catCompleted = 0;
                  const catTotal = tab.tracks.length * 10;
                  tab.tracks.forEach((tId) => {
                    const c = dashboard?.courses.find((course) => course.language === tId);
                    catCompleted += c?.completedLessons ?? (tId === "csharp" ? 1 : 0);
                  });
                  const catPercent = Math.round((catCompleted / Math.max(1, catTotal)) * 100);

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedSubjectTab(tab.id)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isTabActive
                          ? `${tab.activeStyle} scale-[1.02]`
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-750/50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <TabIcon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
                        <span className="leading-tight">{tab.label}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                        {catCompleted}/{catTotal} ({catPercent}%)
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Header Card */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {activeTab === "coding"
                    ? "Programming Languages"
                    : activeTab === "language"
                    ? "Spoken World Languages"
                    : "Mathematics Tracks"}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {activeTab === "coding"
                    ? `${CODING_LANGUAGES.length} Tracks`
                    : activeTab === "language"
                    ? `${SPOKEN_LANGUAGES.length} Languages`
                    : `${MATH_TRACKS.length} Tracks`}
                </span>
              </div>

              {/* Filtered Track Cards */}
              <div className="grid grid-cols-2 gap-2">
                {(activeTab === "coding"
                  ? CODING_LANGUAGES
                  : activeTab === "language"
                  ? SPOKEN_LANGUAGES
                  : MATH_TRACKS
                ).map((langId) => {
                  const lang = SUPPORTED_LANGUAGES[langId];
                  const cData = dashboard?.courses.find((c) => c.language === langId);
                  const count = cData?.completedLessons ?? (langId === "csharp" ? 1 : 0);
                  const trackPercent = Math.round((count / 10) * 100);
                  const isCurrent = langId === currentLanguage;

                  return (
                    <button
                      key={langId}
                      type="button"
                      onClick={() => onSelectLanguage?.(langId)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer group relative ${
                        isCurrent
                          ? "bg-white dark:bg-slate-850 border-2 border-red-500 dark:border-red-500 ring-2 ring-red-500/40 dark:ring-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.4)] dark:shadow-[0_0_20px_rgba(239,68,68,0.55)] scale-[1.01]"
                          : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/70 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                          <LanguageTrackIcon languageId={langId} className="w-3 h-3" />
                          {lang.badge}
                        </span>
                        <div className="flex items-center gap-1">
                          {isCurrent && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-800/60">
                              ACTIVE
                            </span>
                          )}
                          <span
                            className="text-[10px] font-black"
                            style={{ color: getProgressColor(trackPercent) }}
                          >
                            {count}/10
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {lang.label}
                      </div>

                      {/* Mini Bar that also shifts Red -> Green */}
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0.5 border border-slate-200/50 dark:border-slate-700/60">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(8, trackPercent)}%`,
                            background: getProgressGradient(trackPercent),
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
)}
</AnimatePresence>
</div>
);
};
