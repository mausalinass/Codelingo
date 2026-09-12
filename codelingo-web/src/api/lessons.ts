import { apiClient } from "./client";
import type { AdaptiveLessonResponse, LanguageId } from "../types/api";
export const fetchAdaptiveLesson = (language: LanguageId, lessonId: string, userId: string) =>
  apiClient<AdaptiveLessonResponse>(`/api/lessons/${language}/${lessonId}?userId=${encodeURIComponent(userId)}`);
