/* eslint-disable react/only-export-components -- provider and its typed hook form one small state module */
import React, { createContext, useContext, useMemo, useState } from "react";

export type UiLanguage = "es" | "en";
export type ProgrammingTrack = "python" | "javascript" | "typescript" | "csharp";
export type ExperienceLevel = "beginner" | "basic" | "intermediate" | "project_experience";

export interface OnboardingState {
  uiLanguage: UiLanguage | null;
  programmingLanguage: ProgrammingTrack | null;
  experienceLevel: ExperienceLevel | null;
  placementAnswers: Record<string, string>;
  placementScore: number | null;
  recommendedLessonId: string | null;
  completed: boolean;
}

const initialState: OnboardingState = {
  uiLanguage: null,
  programmingLanguage: null,
  experienceLevel: null,
  placementAnswers: {},
  placementScore: null,
  recommendedLessonId: null,
  completed: false,
};

interface OnboardingContextValue {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);
const storageKey = "codelingo_onboarding_v1";

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch {
      return initialState;
    }
  });

  const value = useMemo<OnboardingContextValue>(() => ({
    state,
    update: (patch) => setState((current) => {
      const next = { ...current, ...patch };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    }),
    reset: () => {
      localStorage.removeItem(storageKey);
      setState(initialState);
    },
  }), [state]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return value;
}
