import { apiClient } from "./client";
import type { AdaptiveLessonResponse, LanguageId } from "../types/api";
import { getMockAdaptiveLesson } from "./mockData";

export async function fetchAdaptiveLesson(
  language: LanguageId,
  lessonId: string,
  userId: string
): Promise<AdaptiveLessonResponse> {
  try {
    return await apiClient<AdaptiveLessonResponse>(
      `/api/lessons/${language}/${lessonId}?userId=${encodeURIComponent(userId)}`
    );
  } catch (err) {
    console.warn("Backend unavailable for lesson; serving mock adaptive lesson data:", err);
    return getMockAdaptiveLesson(language, lessonId);
  }
}
