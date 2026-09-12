import type { DashboardResponse, LanguageId, EvaluateRequest, EvaluateResponse } from "../types/api";
import { getCurriculumForTrack, SUPPORTED_LANGUAGES } from "../lib/constants";
import { evaluateMockExercise, getMockAdaptiveLesson } from "./mockData";
const serverTracks = new Set<string>(["python","javascript","typescript","csharp","go","rust","java","cpp"]);
export const isPreviewTrack = (id: string) => !serverTracks.has(id);
const completed = new Map<LanguageId, Set<string>>();
export function previewCourses(): DashboardResponse["courses"] {
 return (Object.keys(SUPPORTED_LANGUAGES) as LanguageId[]).filter(isPreviewTrack).map(language => {
 const curriculum = getCurriculumForTrack(language);
 const done = completed.get(language) ?? new Set<string>();
 const first = curriculum.find(l => !done.has(l.id))?.id;
 return {language, preview: true, completedLessons: done.size, totalLessons: curriculum.length,
 percentage: Math.round(done.size / curriculum.length * 100),
 lessons: curriculum.map(l => ({...l, status: done.has(l.id) ? "completed" : l.id === first ? "current" : "locked"}))};
 });
}
export function previewLesson(language: LanguageId, lessonId: string) {
 if (!SUPPORTED_LANGUAGES[language] || !getCurriculumForTrack(language).some(l => l.id === lessonId)) throw new Error("Unknown preview lesson");
 return getMockAdaptiveLesson(language, lessonId);
}
export function evaluatePreview(request: EvaluateRequest): EvaluateResponse {
 const lesson = previewLesson(request.language, request.lessonId);
 if (lesson.exercise.id !== request.exerciseId) throw new Error("Unknown preview exercise");
 const result = evaluateMockExercise(request);
 if (result.correct) {
 const done = completed.get(request.language) ?? new Set<string>();
 done.add(request.lessonId); completed.set(request.language, done);
 }
 return {...result, xpAwarded: 0, streak: {previous: 0, current: 0, increased: false},
 feedback: {...result.feedback, message: result.feedback.message + " Preview practice only; not saved to your account."}};
}