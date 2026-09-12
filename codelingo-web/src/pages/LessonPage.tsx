import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

import { fetchAdaptiveLesson } from "../api/lessons";
import { fetchPersonality } from "../api/personality";
import { evaluateExercise } from "../api/evaluate";
import { setDemoPersonality } from "../api/demo";
import { fetchDashboard } from "../api/dashboard";
import { DEMO_USER_ID } from "../lib/constants";

import { LessonProgressBar } from "../components/lesson/LessonProgressBar";
import { LouisCoach } from "../components/louis/LouisCoach";
import { PersonalityBadge } from "../components/personality/PersonalityBadge";
import { ConceptCard } from "../components/lesson/ConceptCard";
import { CodeExercise } from "../components/lesson/CodeExercise";
import { FillBlankExercise } from "../components/lesson/FillBlankExercise";
import { FeedbackCard } from "../components/lesson/FeedbackCard";
import { DemoPersonalitySwitch } from "../components/demo/DemoPersonalitySwitch";

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
  }>({
    key: "",
    code: "",
    blank: "",
  });

  const codeAnswer =
    exerciseState.key === lessonKey
      ? exerciseState.code
      : lesson?.exercise.starterCode ?? "";

  const blankAnswer =
    exerciseState.key === lessonKey ? exerciseState.blank : "";

  const setCodeAnswer = (code: string) => {
    setExerciseState({ key: lessonKey, code, blank: blankAnswer });
  };

  const setBlankAnswer = (blank: string) => {
    setExerciseState({ key: lessonKey, code: codeAnswer, blank });
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
      : !blankAnswer.trim();

  const mode = lesson?.presentationMode || "DEEP_EXPLANATION";
  const activeTrait = personality?.primaryTrait || "ANALYTICAL";

  if (isLessonLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <LouisCoach
          mood="thinking"
          message="Preparing your tailored coding exercise..."
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased pb-28">
      {/* Top Bar: Lesson progress bar and close button */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <LessonProgressBar
            progressPercentage={submitStatus === "correct" ? 100 : 50}
          />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
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
              ? "Brilliant! You mastered this conditional logic!"
              : lesson.louisMessage
          }
        />

        {/* Adaptive Mode View Renderers */}
        {mode === "DEEP_EXPLANATION" && (
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

        {mode === "PRACTICE_FIRST" && (
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

        {mode === "VISUAL_GUIDED" && (
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
