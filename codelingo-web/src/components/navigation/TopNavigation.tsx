import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { CourseSelector } from "./CourseSelector";
import { StreakBadge } from "../gamification/StreakBadge";
import { XpBadge } from "../gamification/XpBadge";
import { ThemeToggle } from "./ThemeToggle";
import { CreateAccountModal } from "../auth/CreateAccountModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentStreak = dashboard?.streak.current ?? 0;
  const currentXp = dashboard?.user.totalXp ?? 0;
  const userName = dashboard?.user.displayName ?? "Demo";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-2 sm:py-0 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand logo & Course selector */}
          <div className="flex items-center gap-3.5">
            <Link
              to="/learn"
              className="flex items-center gap-2 group focus:outline-hidden"
              title="Codelingo Learn Path"
            >
              <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-red-500/20 shadow-sm group-hover:shadow-md group-hover:shadow-red-500/30 group-hover:scale-105 transition-all bg-[#12bba8] shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Codelingo Cardinal Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  Code<span className="text-red-600">lingo</span>
                </span>
              </div>
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            <CourseSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
            />
          </div>

          {/* Right: Gamification Badges & Theme Toggle & Create Account & Profile */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
            {dashboard && <StreakBadge streak={currentStreak} increased={streakIncreased} />}
            {dashboard && <XpBadge xp={currentXp} highlighted={xpAwarded} />}

            {/* Dark Mode / Light Mode Toggle */}
            <ThemeToggle />

            {/* Create Account Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-xs hover:shadow-md hover:shadow-red-500/20 active:scale-95 transition-all cursor-pointer select-none"
              title="About the demo profile"
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Demo Profile</span>
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs select-none transition-colors cursor-pointer"
              title={`Demo profile: ${userName}. Click for details.`}
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
