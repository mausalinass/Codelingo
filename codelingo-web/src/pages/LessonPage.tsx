import { isPreviewTrack } from "../api/preview";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

import { fetchAdaptiveLesson } from "../api/lessons";
import { fetchPersonality } from "../api/personality";
import { evaluateExercise } from "../api/evaluate";
import { setDemoPersonality, DEMO_CONTROLS_ENABLED } from "../api/demo";
import { fetchDashboard } from "../api/dashboard";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES } from "../lib/constants";

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

import type { LanguageId, PersonalityTrait, EvaluateResponse } from "../types/api";
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

  const [evaluation, setEvaluation] = useState<EvaluateResponse | null>(null);

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
  const [, setStreakIncreased] = useState(false);

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
      setEvaluation(data);
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
        xpAwarded: evaluation?.xpAwarded ?? 0,
        newStreak: isPreviewTrack(langId) ? dashboard?.streak.current ?? 0 : evaluation?.streak.current ?? dashboard?.streak.current ?? 0,
        preview: isPreviewTrack(langId),
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
  const course = dashboard?.courses.find(c => c.language === langId);

  if (isLessonLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md max-w-md text-center">
          <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">Failed to load lesson</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Could not retrieve the lesson details.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors"
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
        {isPreviewTrack(langId) && <p role="status" className="p-3 border rounded-xl text-amber-800 dark:text-amber-200">Preview practice: not saved to your account; no XP or streak changes.</p>}
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
                  Lesson {course?.lessons.find(l => l.id === lessonId)?.order ?? "—"} of {course?.totalLessons ?? "—"}
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
        {DEMO_CONTROLS_ENABLED && <DemoPersonalitySwitch
          currentTrait={activeTrait}
          onSelectTrait={(trait) => { setSubmitStatus("idle"); setFeedback(undefined); setEvaluation(null); setStreakIncreased(false); demoSwitchMutation.mutate(trait); }}
          isLoading={demoSwitchMutation.isPending || evaluateMutation.isPending}
        />}
        {demoSwitchMutation.isError && <p role="alert" className="text-red-600">The personality change could not be saved. Check the connection or demo permissions.</p>}

        {/* Swell Personality Badge */}
        <PersonalityBadge
          trait={activeTrait}
          mode={mode}
          source={personality?.source || "SWELL_MOCK"}
          score={
            personality?.scores[
              activeTrait.toLowerCase() as keyof typeof personality.scores
            ] ?? 0
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

        {(lesson.exercise.type === "CODE" || lesson.exercise.type === "FILL_BLANK") && <>
        {mode !== "PRACTICE_FIRST" && <ConceptCard title={lesson.title} explanation={lesson.explanation} visualSteps={lesson.visualSteps} isVisualMode={mode === "VISUAL_GUIDED"} />}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
          {lesson.exercise.type === "CODE" ? <CodeExercise prompt={lesson.exercise.prompt} code={codeAnswer} onChange={setCodeAnswer} language={langId} disabled={submitStatus === "correct" || evaluateMutation.isPending} />
          : <FillBlankExercise prompt={lesson.exercise.prompt} blankValue={blankAnswer} onChange={setBlankAnswer} language={langId} placeholder={lesson.exercise.placeholder} disabled={submitStatus === "correct" || evaluateMutation.isPending} hasError={submitStatus === "incorrect"} />}
        </div>
        </>}
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
