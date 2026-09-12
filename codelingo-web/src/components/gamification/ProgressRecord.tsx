import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  ChevronDown,
  Award,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { DashboardResponse, LanguageId } from "../../types/api";
import { SUPPORTED_LANGUAGES } from "../../lib/constants";

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

const getProgressBadgeStyle = (percent: number): { bg: string; text: string; border: string } => {
  if (percent >= 80) {
    return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" };
  }
  if (percent >= 60) {
    return { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-300" };
  }
  if (percent >= 40) {
    return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" };
  }
  if (percent >= 20) {
    return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" };
  }
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" };
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
  defaultExpanded?: boolean;
}

export const ProgressRecord: React.FC<ProgressRecordProps> = ({
  dashboard,
  currentLanguage,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
      color: "text-emerald-500 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Flame Keeper",
      desc: "Maintained a 4+ day streak",
      unlocked: currentStreak >= 4,
      icon: Flame,
      color: "text-orange-500 bg-orange-50 border-orange-200",
    },
    {
      title: "Centurion XP",
      desc: "Earned over 100 XP points",
      unlocked: totalXp >= 100,
      icon: Zap,
      color: "text-amber-500 bg-amber-50 border-amber-200",
    },
    {
      title: "Polyglot Coder",
      desc: "Explored multiple programming tracks",
      unlocked: totalCourses >= 3,
      icon: Trophy,
      color: "text-purple-500 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header Bar: Click to Expand / Collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer focus:outline-hidden"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                {userName}'s Progress
              </h3>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-200">
                <Sparkles className="w-2.5 h-2.5" /> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {completedLessonsTotal} completed • {currentStreak} day streak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {activePercent}%
          </span>
          <div
            className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </button>

      {/* Main KPI Stats Bar */}
      <div className="px-4 sm:px-5 pb-4 pt-1 grid grid-cols-3 gap-2 border-b border-slate-100">
        {/* Streak */}
        <div className="p-2.5 rounded-2xl bg-orange-50/70 border border-orange-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-orange-600 mb-0.5">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-orange-700">
            {currentStreak} <span className="text-[10px] font-bold text-orange-600">days</span>
          </span>
          <span className="text-[9px] text-orange-500/90 font-semibold mt-0.5 truncate">
            Best: {longestStreak}d
          </span>
        </div>

        {/* Total XP */}
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-amber-600 mb-0.5">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total XP</span>
          </div>
          <span className="text-lg sm:text-xl font-black text-amber-700">
            {totalXp}
          </span>
          <span className="text-[9px] text-amber-500/90 font-semibold mt-0.5 truncate">
            Points
          </span>
        </div>

        {/* Mastery with Dynamic Red-to-Green Mini Bar */}
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-2xs">
          <div className="flex items-center gap-1 text-slate-600 mb-0.5">
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
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200/60">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(10, activePercent)}%`,
                background: getProgressGradient(activePercent),
              }}
            />
          </div>
          <span className="text-[9px] font-bold text-slate-500 mt-0.5 truncate">
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
            className="px-4 sm:px-5 py-4 flex flex-col gap-5 bg-slate-50/50"
          >
            {/* Active Track Detailed Progress Bar: Transitions Red -> Green */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between gap-2 text-xs font-bold mb-2">
                <span className="text-slate-800 font-extrabold truncate">
                  {activeLangMeta.label} Track Progress
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} shrink-0`}
                >
                  {activeCompleted} of 10 ({activePercent}%)
                </span>
              </div>

              {/* Dynamic Red-to-Green Progress Bar */}
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 relative shadow-inner">
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
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Novice (Red)
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Mid (Amber)
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Master (Green)
                </span>
              </div>
            </div>

            {/* Milestones / Achievements Grid */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                <Award className="w-3.5 h-3.5" />
                <span>Earned Milestones</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {milestones.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                        m.unlocked
                          ? `${m.color} shadow-2xs`
                          : "bg-slate-100/70 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black leading-tight truncate">
                          {m.title}
                        </div>
                        <div className="text-[10px] opacity-80 leading-snug truncate">
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
            </div>

            {/* All Tracks Progress Overview (with Red-to-Green mini meters) */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                <span>All Tracks Overview</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {overallPercentage}% Total
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SUPPORTED_LANGUAGES) as LanguageId[]).map((langId) => {
                  const lang = SUPPORTED_LANGUAGES[langId];
                  const cData = dashboard?.courses.find((c) => c.language === langId);
                  const count = cData?.completedLessons ?? (langId === "csharp" ? 1 : 0);
                  const trackPercent = Math.round((count / 10) * 100);
                  const isCurrent = langId === currentLanguage;
                  return (
                    <div
                      key={langId}
                      className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isCurrent
                          ? "bg-white border-red-400 ring-2 ring-red-400/20 shadow-2xs"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          {lang.badge}
                        </span>
                        <span
                          className="text-[10px] font-black"
                          style={{ color: getProgressColor(trackPercent) }}
                        >
                          {count}/10
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 truncate">
                        {lang.label}
                      </div>
                      {/* Mini Bar that also shifts Red -> Green */}
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5 border border-slate-200/50">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(8, trackPercent)}%`,
                            background: getProgressGradient(trackPercent),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
