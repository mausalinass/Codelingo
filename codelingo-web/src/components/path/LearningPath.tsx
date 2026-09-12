import React, { useEffect, useRef } from "react";
import { LessonNode } from "./LessonNode";
import type { LanguageId, LessonState } from "../../types/api";
import type { PathLessonNode } from "../../types/lesson";
import { useOnboarding } from "../../context/OnboardingContext";
import { lessonCopy } from "../../lib/lessonTranslations";
import { SUPPORTED_LANGUAGES } from "../../lib/constants";

interface LearningPathProps {
  language: LanguageId;
  lessons: LessonState[];
  isWide?: boolean;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  language,
  lessons,
  isWide = false,
}) => {
  const { state } = useOnboarding();
  const currentLessonRef = useRef<HTMLDivElement>(null);
  const pathNodes: PathLessonNode[] = lessons.map(lesson => ({ ...lesson, ...lessonCopy(lesson.id, state.uiLanguage, lesson), language }));
  const subject = SUPPORTED_LANGUAGES[language].subject;
  const pathPhrases = subject === "coding"
    ? ["Read the code, then run it.", "Bugs are clues.", "Build it one line at a time."]
    : subject === "language"
      ? ["Say it out loud.", "Practice makes it natural.", "A little every day."]
      : ["Draw it. Break it down.", "Patterns make problems easier.", "Check each step."];

  const completedCount = pathNodes.filter((n) => n.status === "completed").length;
  // Progress along the vertical line
  const progressPercentage =
    pathNodes.length > 1
      ? Math.min(100, Math.max(0, (completedCount / (pathNodes.length - 1)) * 100))
      : 0;

  useEffect(() => {
    if (!currentLessonRef.current) return;
    const timer = window.setTimeout(() => currentLessonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
    return () => window.clearTimeout(timer);
  }, [language, lessons]);

  return (
    <div className="relative py-6 sm:py-8 flex flex-col items-center w-full">
      {/* Decorative vertical connector guideline (middle line) */}
      <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-1.5 bg-slate-200 dark:bg-slate-800 rounded-full z-0 pointer-events-none overflow-hidden">
        <div
          className="w-full bg-gradient-to-b from-emerald-500 to-red-500 rounded-full transition-all duration-700 ease-out"
          style={{ height: `${progressPercentage}%` }}
        />
      </div>

      <div
        className={`relative z-10 flex flex-col gap-6 sm:gap-8 w-full ${
          isWide ? "max-w-xl sm:max-w-2xl lg:max-w-3xl" : "max-w-lg sm:max-w-xl"
        } mx-auto transition-all duration-300`}
      >
        {pathNodes.map((node, i) => {
          const isLeft = i % 2 === 0;
          const isCompleted = node.status === "completed";
          const isCurrent = node.status === "current";

          return (
            <React.Fragment key={node.id}>
            <div
              ref={isCurrent ? currentLessonRef : undefined}
              data-current-lesson={isCurrent ? "true" : undefined}
              className="relative grid grid-cols-[1fr_auto_1fr] items-center w-full"
            >
              {/* Left Column: Even indices */}
              {isLeft ? (
                <div className="flex items-center justify-end pr-1.5 sm:pr-3">
                  <LessonNode lesson={node} />
                  {/* Connecting branch to middle line */}
                  <div
                    className={`h-0.5 ${
                      isWide ? "w-3 sm:w-8 md:w-12" : "w-3 sm:w-6"
                    } rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-400 dark:bg-emerald-500"
                        : isCurrent
                        ? "bg-red-400 dark:bg-red-500"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                </div>
              ) : (
                <div className="pr-1.5 sm:pr-3" />
              )}

              {/* Center Column: Waypoint on the middle line */}
              <div className="relative flex items-center justify-center w-6 sm:w-8">
                <div
                  className={`rounded-full border-2 transition-all ${
                    isCompleted
                      ? "w-4 h-4 bg-emerald-500 border-white dark:border-slate-900 shadow-xs shadow-emerald-500/40"
                      : isCurrent
                      ? "w-4 h-4 bg-red-600 border-white dark:border-slate-900 ring-4 ring-red-500/30 animate-pulse"
                      : "w-3 h-3 bg-slate-300 dark:bg-slate-700 border-white dark:border-slate-900"
                  }`}
                />
              </div>

              {/* Right Column: Odd indices */}
              {!isLeft ? (
                <div className="flex items-center justify-start pl-1.5 sm:pl-3">
                  {/* Connecting branch to middle line */}
                  <div
                    className={`h-0.5 ${
                      isWide ? "w-3 sm:w-8 md:w-12" : "w-3 sm:w-6"
                    } rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-400 dark:bg-emerald-500"
                        : isCurrent
                        ? "bg-red-400 dark:bg-red-500"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                  <LessonNode lesson={node} />
                </div>
              ) : (
                <div className="pl-1.5 sm:pl-3" />
              )}
            </div>
            {[1, 4, 7].includes(i) && (
              <div className={`relative z-20 flex items-center ${i % 2 ? "justify-start" : "justify-end"} px-4 sm:px-10`}>
                <div className="flex max-w-sm items-center gap-3 rounded-2xl border-2 border-blue-100 bg-blue-50/95 p-3 shadow-md dark:border-blue-900/60 dark:bg-blue-950/70">
                  <img src={i === 4 ? "/louis-thinking-2_5d.png" : "/louis-celebrating-2_5d.png"} alt="Louis coaching along the learning path" className={`louis-idle h-20 w-20 shrink-0 object-contain ${i === 7 ? "[animation-delay:700ms]" : ""}`} />
                  <p className="text-sm font-black text-blue-950 dark:text-blue-100">{pathPhrases[Math.floor(i / 3)]}</p>
                </div>
              </div>
            )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

