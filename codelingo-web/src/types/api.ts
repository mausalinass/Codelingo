export type CodingLanguageId =
  | "python"
  | "javascript"
  | "typescript"
  | "csharp"
  | "rust"
  | "go"
  | "cpp"
  | "java"
  | "kotlin"
  | "swift";

export type SpokenLanguageId =
  | "spanish"
  | "french"
  | "german"
  | "japanese"
  | "italian"
  | "portuguese"
  | "mandarin"
  | "korean"
  | "russian"
  | "arabic";

export type MathTrackId =
  | "math_basics"
  | "math_fractions"
  | "math_algebra"
  | "math_geometry"
  | "math_mental";

export type LanguageId = CodingLanguageId | SpokenLanguageId | MathTrackId;

export type SubjectCategory = "coding" | "language" | "math";

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
    type: "CODE" | "FILL_BLANK" | "WORD_BANK" | "MATH_INPUT";
    prompt: string;
    starterCode?: string;
    placeholder?: string;
    // Duolingo Spoken Language features
    targetSentence?: string;
    translationPrompt?: string;
    wordBank?: string[];
    audioText?: string;
    // Duolingo Math features
    mathVisual?: {
      type: "fraction_pie" | "grid_array" | "equation" | "geometry_shape";
      title?: string;
      value?: string | number;
      numerator?: number;
      denominator?: number;
      rows?: number;
      cols?: number;
      shape?: "triangle" | "rectangle" | "circle";
      dimensions?: string;
    };
    choices?: string[];
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
