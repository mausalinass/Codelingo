export type LanguageId = "python" | "javascript" | "csharp";
export type PersonalityTrait = "ANALYTICAL" | "PRACTICAL" | "VISUAL";
export type LearningMode = "DEEP_EXPLANATION" | "PRACTICE_FIRST" | "VISUAL_GUIDED";
export type LessonStatus = "completed" | "current" | "locked";

export interface DashboardResponse {
  user: {
    id: string;
    displayName: string;
    totalXp: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  activeLanguage: LanguageId;
  courses: Array<{
    language: LanguageId;
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  }>;
}

export interface PersonalityResponse {
  source: "SWELL" | "SWELL_MOCK";
  primaryTrait: PersonalityTrait;
  learningMode: LearningMode;
  scores: {
    analytical: number;
    practical: number;
    visual: number;
  };
}

export interface AdaptiveLessonResponse {
  lessonId: string;
  language: LanguageId;
  personality: PersonalityTrait;
  presentationMode: LearningMode;
  title: string;
  louisMessage: string;
  explanation: string | null;
  visualSteps?: string[];
  showExplanationFirst: boolean;
  exercise: {
    id: string;
    type: "CODE" | "FILL_BLANK";
    prompt: string;
    starterCode: string;
    placeholder?: string;
  };
}

export interface EvaluateRequest {
  userId: string;
  language: LanguageId;
  lessonId: string;
  exerciseId: string;
  answer: string;
}

export interface EvaluateResponse {
  correct: boolean;
  xpAwarded: number;
  feedback: {
    title: string;
    message: string;
  };
  progress: {
    lessonCompleted: boolean;
    languagePercentage: number;
  };
  streak: {
    previous: number;
    current: number;
    increased: boolean;
  };
}
