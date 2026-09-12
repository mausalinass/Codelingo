import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

import { fetchAdaptiveLesson } from "../api/lessons";
import { fetchPersonality } from "../api/personality";
import { evaluateExercise } from "../api/evaluate";
import { setDemoPersonality } from "../api/demo";
import { fetchDashboard } from "../api/dashboard";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES, getCurriculumForTrack } from "../lib/constants";

import { LessonProgressBar } from "../components/lesson/LessonProgressBar";
import { LouisCoach } from "../components/louis/LouisCoach";
import { PersonalityBadge } from "../components/personality/PersonalityBadge";
import { ConceptCard } from "../components/lesson/ConceptCard";
import { CodeExercise } from "../components/lesson/CodeExercise";
import { FillBlankExercise } from "../components/lesson/FillBlankExercise";
import { WordBankExercise } from "../components/lesson/WordBankExercise";
import { MathExercise } from "../components/lesson/MathExercise";
import { FeedbackCard } from "../components/lesson/FeedbackCard";
import { DemoPersonalitySwitch } from "../components/demo/DemoPersonalitySwitch";
import { ThemeToggle } from "../components/navigation/ThemeToggle";
import { LessonTopicIcon, LanguageTrackIcon } from "../lib/icons";

import type { LanguageId, PersonalityTrait } from "../types/api";
import type { LouisMood, SubmitStatus } from "../types/lesson";

export const LessonPage: React.FC = () => {
  const { language = "csharp", lessonId = "conditions" } = useParams<{
    language: LanguageId;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const langId = language as LanguageId;

  // Query: Dashboard (for streak and XP)
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard", DEMO_USER_ID],
    queryFn: () => fetchDashboard(DEMO_USER_ID),
  });

  // Query: Swell Personality
  const { data: personality } = useQuery({
    queryKey: ["personality", DEMO_USER_ID],
    queryFn: () => fetchPersonality(DEMO_USER_ID),
  });

  // Query: Adaptive Lesson Payload
  const {
    data: lesson,
    isLoading: isLessonLoading,
    error: lessonError,
  } = useQuery({
    queryKey: ["adaptiveLesson", langId, lessonId, personality?.primaryTrait],
    queryFn: () => fetchAdaptiveLesson(langId, lessonId, DEMO_USER_ID),
  });

  // Exercise answer state keyed to the active lesson mode
  const lessonKey = `${lesson?.exercise.id}-${lesson?.presentationMode}`;
  const [exerciseState, setExerciseState] = useState<{
    key: string;
    code: string;
    blank: string;
    custom: string;
  }>({
    key: "",
    code: "",
    blank: "",
    custom: "",
  });

  const codeAnswer =
    exerciseState.key === lessonKey
      ? exerciseState.code
      : lesson?.exercise.starterCode ?? "";

  const blankAnswer =
    exerciseState.key === lessonKey ? exerciseState.blank : "";

  const customAnswer =
    exerciseState.key === lessonKey ? exerciseState.custom : "";

  const setCodeAnswer = (code: string) => {
    setExerciseState({ key: lessonKey, code, blank: blankAnswer, custom: customAnswer });
  };

  const setBlankAnswer = (blank: string) => {
    setExerciseState({ key: lessonKey, code: codeAnswer, blank, custom: customAnswer });
  };

  const setCustomAnswer = (custom: string) => {
    setExerciseState({ key: lessonKey, code: codeAnswer, blank: blankAnswer, custom });
  };

  // Submit and feedback states
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [feedback, setFeedback] = useState<{ title: string; message: string } | undefined>();
  const [streakIncreased, setStreakIncreased] = useState(false);

  // Demo Personality Mutation
  const demoSwitchMutation = useMutation({
    mutationFn: (trait: PersonalityTrait) => setDemoPersonality(DEMO_USER_ID, trait),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personality", DEMO_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["adaptiveLesson", langId, lessonId] });
    },
  });

  // Evaluate Exercise Mutation
  const evaluateMutation = useMutation({
    mutationFn: evaluateExercise,
    onSuccess: (data) => {
      if (data.correct) {
        setSubmitStatus("correct");
        setFeedback(data.feedback);

        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#E52E2E", "#58CC02", "#FF9600", "#3B82F6"],
        });

        // Trigger streak payoff if increased
        if (data.streak.increased) {
          setStreakIncreased(true);
        }

        // Invalidate dashboard so new XP and streak refetch
        queryClient.invalidateQueries({ queryKey: ["dashboard", DEMO_USER_ID] });
      } else {
        setSubmitStatus("incorrect");
        setFeedback(data.feedback);
      }
    },
    onError: (err) => {
      console.error("Evaluation error:", err);
      setSubmitStatus("requestError");
    },
  });

  // Determine current active Louis mood
  let louisMood: LouisMood = "encouraging";
  if (submitStatus === "correct") {
    louisMood = "celebrating";
  } else if (lesson?.presentationMode === "DEEP_EXPLANATION") {
    louisMood = "thinking";
  } else {
    louisMood = "encouraging";
  }

  // Handle Check submission
  const handleCheck = () => {
    if (!lesson) return;
    setSubmitStatus("submitting");

    const activeAnswer =
      lesson.exercise.type === "CODE"
        ? codeAnswer
        : lesson.exercise.type === "WORD_BANK" || lesson.exercise.type === "MATH_INPUT"
        ? customAnswer.trim()
        : blankAnswer.trim();

    evaluateMutation.mutate({
      userId: DEMO_USER_ID,
      language: langId,
      lessonId,
      exerciseId: lesson.exercise.id,
      answer: activeAnswer,
    });
  };

  // Handle Continue to Complete page
  const handleContinue = () => {
    navigate("/complete", {
      state: {
        language: langId,
        lessonTitle: lesson?.title || "Lesson Complete",
        xpAwarded: 10,
        newStreak: (dashboard?.streak.current ?? 4) + (streakIncreased ? 1 : 0),
      },
    });
  };

  // Handle Try Again
  const handleTryAgain = () => {
    setSubmitStatus("idle");
    setFeedback(undefined);
  };

  const isAnswerEmpty =
    lesson?.exercise.type === "CODE"
      ? !codeAnswer.trim()
      : lesson?.exercise.type === "WORD_BANK" || lesson?.exercise.type === "MATH_INPUT"
      ? !customAnswer.trim()
      : !blankAnswer.trim();

  const mode = lesson?.presentationMode || "DEEP_EXPLANATION";
  const activeTrait = personality?.primaryTrait || "ANALYTICAL";
  const trackMeta = SUPPORTED_LANGUAGES[langId] || SUPPORTED_LANGUAGES.csharp;
  const curriculum = getCurriculumForTrack(langId);
  const lessonOrder = curriculum.find((l) => l.id === lessonId)?.order || 1;

  if (isLessonLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <LouisCoach
          mood="thinking"
          message="Preparing your tailored exercise..."
          className="max-w-md"
        />
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-md text-center">
          <h2 className="text-lg font-bold text-rose-600 mb-2">Failed to load lesson</h2>
          <p className="text-sm text-slate-600 mb-4">
            Could not retrieve the lesson details.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm"
          >
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased pb-28 transition-colors">
      {/* Top Bar: Lesson progress bar, close button & theme toggle */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <LessonProgressBar
              progressPercentage={submitStatus === "correct" ? 100 : 50}
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
        {/* Lesson & Language Type Header Card */}
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <LessonTopicIcon lessonId={lessonId} className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <LanguageTrackIcon languageId={langId} className="w-3.5 h-3.5" />
                  {trackMeta.label}
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Lesson {lessonOrder} of {curriculum.length}
                </span>
              </div>
              <h1 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-tight mt-0.5">
                {lesson.title}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span>Adaptive Mode</span>
          </div>
        </div>

        {/* Floating Demo Personality Switcher for Judges */}
        <DemoPersonalitySwitch
          currentTrait={activeTrait}
          onSelectTrait={(trait) => demoSwitchMutation.mutate(trait)}
          isLoading={demoSwitchMutation.isPending}
        />

        {/* Swell Personality Badge */}
        <PersonalityBadge
          trait={activeTrait}
          mode={mode}
          source={personality?.source || "SWELL"}
          score={
            personality?.scores[
              activeTrait.toLowerCase() as keyof typeof personality.scores
            ] || 88
          }
        />

        {/* Louis Coach with Adaptive Message */}
        <LouisCoach
          mood={louisMood}
          message={
            submitStatus === "correct"
              ? "Brilliant! You mastered this challenge!"
              : lesson.louisMessage
          }
        />

        {/* 1. Spoken Language: Duolingo Word Bank Exercise */}
        {lesson.exercise.type === "WORD_BANK" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs animate-in fade-in duration-200">
            <WordBankExercise
              key={lesson.exercise.id}
              prompt={lesson.exercise.prompt}
              targetSentence={lesson.exercise.targetSentence}
              wordBank={lesson.exercise.wordBank}
              audioText={lesson.exercise.audioText}
              onChange={setCustomAnswer}
              disabled={submitStatus === "correct"}
              hasError={submitStatus === "incorrect"}
            />
          </div>
        )}

        {/* 2. Mathematics: Duolingo Math Interactive Exercise */}
        {lesson.exercise.type === "MATH_INPUT" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs animate-in fade-in duration-200">
            <MathExercise
              key={lesson.exercise.id}
              prompt={lesson.exercise.prompt}
              value={customAnswer}
              onChange={setCustomAnswer}
              disabled={submitStatus === "correct"}
              hasError={submitStatus === "incorrect"}
              choices={lesson.exercise.choices}
              mathVisual={lesson.exercise.mathVisual}
              placeholder={lesson.exercise.placeholder}
            />
          </div>
        )}

        {/* 3. Programming: Adaptive Mode View Renderers */}
        {lesson.exercise.type === "CODE" && mode === "DEEP_EXPLANATION" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            {/* Concept Card with Technical Deep Dive */}
            <ConceptCard
              title={lesson.title}
              explanation={lesson.explanation}
              visualSteps={lesson.visualSteps}
            />

            {/* CodeMirror Code Exercise */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <CodeExercise
                prompt={lesson.exercise.prompt}
                code={codeAnswer}
                onChange={setCodeAnswer}
                language={langId}
                disabled={submitStatus === "correct"}
              />
            </div>
          </div>
        )}

        {lesson.exercise.type !== "WORD_BANK" &&
          lesson.exercise.type !== "MATH_INPUT" &&
          mode === "PRACTICE_FIRST" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              {/* Quick Interactive Exercise */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <FillBlankExercise
                  prompt={lesson.exercise.prompt}
                  blankValue={blankAnswer}
                  onChange={setBlankAnswer}
                  language={langId}
                  placeholder={lesson.exercise.placeholder}
                  disabled={submitStatus === "correct"}
                  hasError={submitStatus === "incorrect"}
                />
              </div>
            </div>
          )}

        {lesson.exercise.type !== "WORD_BANK" &&
          lesson.exercise.type !== "MATH_INPUT" &&
          mode === "VISUAL_GUIDED" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              {/* Visual Flowchart Diagram */}
              <ConceptCard
                title={lesson.title}
                explanation={lesson.explanation}
                visualSteps={lesson.visualSteps}
                isVisualMode={true}
              />

              {/* Guided Blank Challenge */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <FillBlankExercise
                  prompt={lesson.exercise.prompt}
                  blankValue={blankAnswer}
                  onChange={setBlankAnswer}
                  language={langId}
                  placeholder={lesson.exercise.placeholder}
                  disabled={submitStatus === "correct"}
                  hasError={submitStatus === "incorrect"}
                />
              </div>
            </div>
          )}
      </main>

      {/* Bottom Feedback / Submit Sheet */}
      <FeedbackCard
        status={submitStatus}
        feedback={feedback}
        isAnswerEmpty={isAnswerEmpty}
        onCheck={handleCheck}
        onContinue={handleContinue}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
};
