import React from "react";
import { Link } from "react-router-dom";
import { CourseSelector } from "./CourseSelector";
import { StreakBadge } from "../gamification/StreakBadge";
import { XpBadge } from "../gamification/XpBadge";
import type { DashboardResponse, LanguageId } from "../../types/api";

interface TopNavigationProps {
  dashboard?: DashboardResponse;
  currentLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  streakIncreased?: boolean;
  xpAwarded?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  dashboard,
  currentLanguage,
  onSelectLanguage,
  streakIncreased,
  xpAwarded,
}) => {
  const currentStreak = dashboard?.streak.current ?? 4;
  const currentXp = dashboard?.user.totalXp ?? 120;
  const userName = dashboard?.user.displayName ?? "Alex";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand logo & Course selector */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/learn"
            className="flex items-center gap-2 group focus:outline-hidden"
            title="Codelingo Learn Path"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">CL</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl tracking-tight text-slate-900">
                Code<span className="text-red-600">lingo</span>
              </span>
            </div>
          </Link>

          <div className="h-6 w-px bg-slate-200" />

          <CourseSelector
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
          />
        </div>

        {/* Right: Gamification Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <StreakBadge streak={currentStreak} increased={streakIncreased} />
          <XpBadge xp={currentXp} highlighted={xpAwarded} />

          <div
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs select-none"
            title={`Logged in as ${userName}`}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
