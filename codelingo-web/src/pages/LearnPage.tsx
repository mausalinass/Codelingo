import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard";
import { fetchPersonality } from "../api/personality";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES, LESSON_TEMPLATES } from "../lib/constants";
import { AppShell } from "../components/layout/AppShell";
import { LearningPath } from "../components/path/LearningPath";
import { LouisCoach } from "../components/louis/LouisCoach";
import { PersonalityBadge } from "../components/personality/PersonalityBadge";
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
    >
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
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
              {courseData?.percentage ?? 12}% completed • {completedCount} of {totalCount} lessons
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-mono font-black text-lg text-white border border-white/20">
            {activeLangMeta.badge}
          </div>
        </div>

        {/* Duolingo Staggered Learning Path */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {isDashboardLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-bold text-slate-400">
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
    </AppShell>
  );
};
