import { apiClient } from "./client";
import type { ExperienceLevel, ProgrammingTrack, UiLanguage } from "../context/OnboardingContext";

export interface OnboardingResponse {
  uiLanguage: UiLanguage;
  programmingLanguage: ProgrammingTrack;
  experienceLevel: ExperienceLevel;
  onboardingCompleted: boolean;
  startingLessonId: string | null;
  correctAnswers: number | null;
  totalQuestions: number | null;
  recommendedLessonId: string | null;
}

export const saveOnboardingPreferences = (userId: string, uiLanguage: UiLanguage, programmingLanguage: ProgrammingTrack, experienceLevel: ExperienceLevel) =>
  apiClient<OnboardingResponse>("/api/onboarding/preferences", { method: "POST", body: JSON.stringify({ userId, uiLanguage, programmingLanguage, experienceLevel }) });

export const savePlacement = (userId: string, language: ProgrammingTrack, answers: Record<string, string>) =>
  apiClient<{ correctAnswers: number; totalQuestions: number; recommendedLessonId: string; recommendedLessonTitle: string }>("/api/onboarding/placement", { method: "POST", body: JSON.stringify({ userId, language, answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })) }) });

export const completeOnboarding = (userId: string, startingLessonId: string) =>
  apiClient<OnboardingResponse>("/api/onboarding/complete", { method: "POST", body: JSON.stringify({ userId, startingLessonId }) });
