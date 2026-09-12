import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard";
import { fetchPersonality } from "../api/personality";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES, LESSON_TEMPLATES } from "../lib/constants";
import { AppShell } from "../components/layout/AppShell";
import { LearningPath } from "../components/path/LearningPath";
import { LouisCoach } from "../components/louis/LouisCoach";
import { PersonalityBadge } from "../components/personality/PersonalityBadge";
import { ProgressRecord } from "../components/gamification/ProgressRecord";
import { LanguageTrackIcon } from "../lib/icons";
import type { LanguageId } from "../types/api";

interface LearnPageProps {
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboard", DEMO_USER_ID],
    queryFn: () => fetchDashboard(DEMO_USER_ID),
  });

  const { data: personality } = useQuery({
    queryKey: ["personality", DEMO_USER_ID],
    queryFn: () => fetchPersonality(DEMO_USER_ID),
  });

  const activeLangMeta = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES.csharp;

  // Derive completed lessons for active language
  const courseData = dashboard?.courses.find((c) => c.language === selectedLanguage);
  const completedCount = courseData?.completedLessons ?? 1;
  const totalCount = courseData?.totalLessons ?? 10;
  const completedLessonIds = LESSON_TEMPLATES.map((l) => l.id).slice(0, completedCount);

  return (
    <AppShell
      dashboard={dashboard}
      currentLanguage={selectedLanguage}
      onSelectLanguage={onSelectLanguage}
      maxWidth="max-w-6xl xl:max-w-7xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full">
        {/* Main Learning Column (Left / Center) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6 w-full order-2 lg:order-1">
          {/* Swell Personality Badge */}
          {personality && (
            <PersonalityBadge
              trait={personality.primaryTrait}
              mode={personality.learningMode}
              source={personality.source}
              score={
                personality.scores[
                  personality.primaryTrait.toLowerCase() as keyof typeof personality.scores
                ] || 88
              }
            />
          )}

          {/* Louis Mascot Greeting */}
          <LouisCoach
            mood="idle"
            message={`Welcome back, ${
              dashboard?.user.displayName || "Alex"
            }! Let's continue your ${activeLangMeta.label} track.`}
          />

          {/* Course Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-red-400">
                Active Track
              </div>
              <h2 className="text-xl font-black tracking-tight mt-0.5">
                {activeLangMeta.label} Mastery
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {courseData?.percentage ?? 10}% completed • {completedCount} of {totalCount} lessons
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-xs">
              <LanguageTrackIcon languageId={selectedLanguage} className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* Duolingo Staggered Learning Path */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
            {isDashboardLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-sm font-bold text-slate-400 dark:text-slate-500">
                  Loading learning path...
                </div>
              </div>
            ) : (
              <LearningPath
                language={selectedLanguage}
                completedLessons={completedLessonIds}
              />
            )}
          </div>
        </div>

        {/* Side Column: Sticky Progress Record with Red-to-Green dynamic meter */}
        <aside className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6 w-full order-1 lg:order-2 lg:sticky lg:top-20">
          <ProgressRecord
            dashboard={dashboard}
            currentLanguage={selectedLanguage}
            defaultExpanded={true}
          />
        </aside>
      </div>
    </AppShell>
  );
};
