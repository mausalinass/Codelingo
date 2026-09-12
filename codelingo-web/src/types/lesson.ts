import type { LanguageId, LessonStatus } from "./api";

export interface PathLessonNode {
  id: string;
  title: string;
  description: string;
  language: LanguageId;
  order: number;
  status: LessonStatus;
}

export type LouisMood = "idle" | "thinking" | "encouraging" | "celebrating";

export type SubmitStatus = "idle" | "submitting" | "correct" | "incorrect" | "requestError";
