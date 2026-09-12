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

interface ProgressRecordProps {
  dashboard?: DashboardResponse;
  currentLanguage: LanguageId;
}

export const ProgressRecord: React.FC<ProgressRecordProps> = ({
  dashboard,
  currentLanguage,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentStreak = dashboard?.streak.current ?? 4;
  const longestStreak = dashboard?.streak.longest ?? 7;
  const totalXp = dashboard?.user.totalXp ?? 120;
  const userName = dashboard?.user.displayName ?? "Alex";

  // Calculate overall stats
  const totalCourses = dashboard?.courses.length ?? 8;
  const completedLessonsTotal =
    dashboard?.courses.reduce((acc, c) => acc + c.completedLessons, 0) ?? 1;
  const totalPossibleLessons = (dashboard?.courses.length ?? 8) * 10;
  const overallPercentage = Math.round(
    (completedLessonsTotal / Math.max(1, totalPossibleLessons)) * 100
  );

  // Active track stats
  const activeCourse = dashboard?.courses.find((c) => c.language === currentLanguage);
  const activeCompleted = activeCourse?.completedLessons ?? 1;
  const activePercent = activeCourse?.percentage ?? 10;
  const activeLangMeta = SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES.csharp;

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Header Bar: Click to Expand / Collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 transition-colors cursor-pointer focus:outline-hidden"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {userName}'s Progress Record
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {completedLessonsTotal} lessons completed • {currentStreak} day streak record
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Track Mastery</span>
            <span className="text-sm font-black text-slate-800">{activePercent}%</span>
          </div>
          <div
            className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Main KPI Stats Bar */}
      <div className="px-5 sm:px-6 pb-4 pt-1 grid grid-cols-3 gap-2 sm:gap-3 border-b border-slate-100">
        <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-orange-600 mb-0.5">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-orange-700">
            {currentStreak} <span className="text-xs font-bold text-orange-600">days</span>
          </span>
          <span className="text-[10px] text-orange-500/90 font-semibold mt-0.5">
            Best: {longestStreak} days
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-amber-600 mb-0.5">
            <Zap className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-700">
            {totalXp}
          </span>
          <span className="text-[10px] text-amber-500/90 font-semibold mt-0.5">
            Points earned
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Mastery</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {activeCompleted}/10
          </span>
          <span className="text-[10px] text-emerald-600/90 font-semibold mt-0.5">
            {activeLangMeta.badge} Track
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
            className="px-5 sm:px-6 py-5 flex flex-col gap-6 bg-slate-50/40"
          >
            {/* Active Track Detailed Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">
                  {activeLangMeta.label} Curriculum Progress
                </span>
                <span className="text-red-600">{activeCompleted} of 10 Lessons ({activePercent}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, activePercent)}%` }}
                />
              </div>
            </div>

            {/* Milestones / Achievements Grid */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <Award className="w-4 h-4" />
                <span>Earned Milestones</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {milestones.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                        m.unlocked
                          ? `${m.color} shadow-2xs`
                          : "bg-slate-100/60 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className="p-1.5 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold leading-tight">
                          {m.title}
                        </div>
                        <div className="text-[11px] opacity-80 leading-snug mt-0.5">
                          {m.desc}
                        </div>
                      </div>
                      {m.unlocked && (
                        <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-current" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Tracks Progress Overview */}
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <span>All Programming Tracks</span>
                <span className="text-[10px] font-bold text-slate-500">
                  Overall: {overallPercentage}%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(SUPPORTED_LANGUAGES) as LanguageId[]).map((langId) => {
                  const lang = SUPPORTED_LANGUAGES[langId];
                  const cData = dashboard?.courses.find((c) => c.language === langId);
                  const count = cData?.completedLessons ?? (langId === "csharp" ? 1 : 0);
                  const isCurrent = langId === currentLanguage;
                  return (
                    <div
                      key={langId}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isCurrent
                          ? "bg-red-50/70 border-red-200 shadow-2xs"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          {lang.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {count}/10
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 truncate">
                        {lang.label}
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.round((count / 10) * 100)}%` }}
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
