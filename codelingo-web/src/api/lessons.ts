import { apiClient } from "./client";
import { isPreviewTrack, previewLesson } from "./preview";
import type { AdaptiveLessonResponse, LanguageId } from "../types/api";
export const fetchAdaptiveLesson = async (language: LanguageId, lessonId: string, userId: string) =>
 isPreviewTrack(language) ? previewLesson(language, lessonId) :
 apiClient<AdaptiveLessonResponse>(`/api/lessons/${language}/${lessonId}?userId=${encodeURIComponent(userId)}`);