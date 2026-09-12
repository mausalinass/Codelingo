import { apiClient } from "./client";
import { isPreviewTrack, previewLesson } from "./preview";
import type { AdaptiveLessonResponse, LanguageId, PersonalityTrait } from "../types/api";
export const fetchAdaptiveLesson = async (language: LanguageId, lessonId: string, userId: string, personality?: PersonalityTrait) =>
 isPreviewTrack(language) ? previewLesson(language, lessonId, personality) :
 apiClient<AdaptiveLessonResponse>(`/api/lessons/${language}/${lessonId}?userId=${encodeURIComponent(userId)}`);
