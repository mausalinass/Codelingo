import { isPreviewTrack } from "../api/preview";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/dashboard";
import { fetchPersonality } from "../api/personality";
import { DEMO_USER_ID } from "../lib/constants";
import { AppShell } from "../components/layout/AppShell";
import { LearningPath } from "../components/path/LearningPath";
import { LouisConnectionStatus } from "../components/louis/LouisCompanion";
import { PersonalityBadge } from "../components/personality/PersonalityBadge";
import { ProgressRecord } from "../components/gamification/ProgressRecord";
import type { LanguageId } from "../types/api";
import { CourseSectionHero } from "../components/path/CourseSectionHero";

interface LearnPageProps {
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [isProgressExpanded, setIsProgressExpanded] = React.useState<boolean>(() => {
    const saved = localStorage.getItem("codelingo_progress_expanded");
    return saved !== null ? saved === "true" : true;
  });

  const toggleProgress = () => {
    setIsProgressExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("codelingo_progress_expanded", String(next));
      return next;
    });
  };

  const { data: dashboard, isLoading: isDashboardLoading, error: dashboardError, refetch } = useQuery({
    queryKey: ["dashboard", DEMO_USER_ID],
    queryFn: () => fetchDashboard(DEMO_USER_ID),
  });

  const { data: personality, error: personalityError, refetch: refetchPersonality } = useQuery({
    queryKey: ["personality", DEMO_USER_ID],
    queryFn: () => fetchPersonality(DEMO_USER_ID),
  });

  // Derive completed lessons for active language using its dedicated curriculum
  const courseData = dashboard?.courses.find((c) => c.language === selectedLanguage);
  const completedCount = courseData?.completedLessons ?? 0;
  const totalCount = courseData?.totalLessons ?? 0;

  return (
    <AppShell
      dashboard={dashboard}
      currentLanguage={selectedLanguage}
      onSelectLanguage={onSelectLanguage}
      maxWidth={isProgressExpanded ? "max-w-6xl xl:max-w-7xl" : "max-w-7xl 2xl:max-w-[88rem]"}
    >
      <LouisConnectionStatus />
      {(dashboardError || personalityError) && <div role="alert" className="p-4 text-red-700 dark:text-red-300">Unable to load saved progress or personality. <button onClick={() => { void refetch(); void refetchPersonality(); }}>Retry</button></div>}
      {isPreviewTrack(selectedLanguage) && <p role="status" className="rounded-xl border p-4 text-amber-800 dark:text-amber-200">Preview track: practice is available in this session only. It does not change saved XP, streaks or account progress.</p>}
      {/* When Progress Panel is REDUCED: Show sleek compact bar at top & Lesson Panel fills most of the screen below */}
      {!isProgressExpanded ? (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
          {/* Reduced Compact Progress Ribbon */}
          <ProgressRecord
            dashboard={dashboard}
            currentLanguage={selectedLanguage}
            onSelectLanguage={onSelectLanguage}
            isExpanded={false}
            onToggleExpand={toggleProgress}
            variant="compact"
          />

          {/* Full-width Lesson Panel below */}
          <div className="flex flex-col gap-6 w-full">
            {/* Swell Personality Badge */}
            {personality && (
              <PersonalityBadge
                trait={personality.primaryTrait}
                mode={personality.learningMode}
                source={personality.source}
                score={
                  personality.scores[
                    personality.primaryTrait.toLowerCase() as keyof typeof personality.scores
                  ] ?? 0
                }
              />
            )}

            <CourseSectionHero language={selectedLanguage} percentage={courseData?.percentage ?? 0} completed={completedCount} total={totalCount} />

            {/* Duolingo Staggered Learning Path (Expansive & Centerpiece) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs transition-colors">
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
                  lessons={courseData?.lessons ?? []}
                  isWide={true}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* When Progress Panel is EXPANDED: 2-column layout with sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full animate-in fade-in duration-300">
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
                  ] ?? 0
                }
              />
            )}

            <CourseSectionHero language={selectedLanguage} percentage={courseData?.percentage ?? 0} completed={completedCount} total={totalCount} />

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
                  lessons={courseData?.lessons ?? []}
                  isWide={false}
                />
              )}
            </div>
          </div>

          {/* Side Column: Sticky Progress Record with Red-to-Green dynamic meter */}
          <aside className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6 w-full order-1 lg:order-2 lg:sticky lg:top-20">
            <ProgressRecord
              dashboard={dashboard}
              currentLanguage={selectedLanguage}
              onSelectLanguage={onSelectLanguage}
              isExpanded={true}
              onToggleExpand={toggleProgress}
              variant="sidebar"
            />
          </aside>
        </div>
      )}
    </AppShell>
  );
};
