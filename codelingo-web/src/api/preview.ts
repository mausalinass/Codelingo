import type { DashboardResponse, LanguageId, EvaluateRequest, EvaluateResponse } from "../types/api";
import { getCurriculumForTrack, SUPPORTED_LANGUAGES } from "../lib/constants";
import { evaluateMockExercise, getMockAdaptiveLesson } from "./mockData";
const serverTracks = new Set<string>(["python","javascript","typescript","csharp","go","rust","java","cpp"]);
export const isPreviewTrack = (id: string) => !serverTracks.has(id);
const completed = new Map<LanguageId, Set<string>>();
const previewAttempts = new Map<string, number>();
const previewResolved = new Map<string, Set<string>>();
const streakKey = "codelingo_preview_streak";
type PreviewStreak = { current: number; longest: number; lastDate: string | null };
const todayKey = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; };
const readStreak = (): PreviewStreak => {
 try { return JSON.parse(localStorage.getItem(streakKey) || "null") ?? {current: 0, longest: 0, lastDate: null}; }
 catch { return {current: 0, longest: 0, lastDate: null}; }
};
const saveStreak = (streak: PreviewStreak) => localStorage.setItem(streakKey, JSON.stringify(streak));
const daysBetween = (from: string, to: string) => Math.round((new Date(`${to}T12:00:00`).getTime() - new Date(`${from}T12:00:00`).getTime()) / 86_400_000);
export function previewStreak() { const {current, longest} = readStreak(); return {current, longest}; }
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
export function previewLesson(language: LanguageId, lessonId: string, trait?: Parameters<typeof getMockAdaptiveLesson>[2]) {
 if (!SUPPORTED_LANGUAGES[language] || !getCurriculumForTrack(language).some(l => l.id === lessonId)) throw new Error("Unknown preview lesson");
 return getMockAdaptiveLesson(language, lessonId, trait);
}
export function evaluatePreview(request: EvaluateRequest): EvaluateResponse {
 const lesson = previewLesson(request.language, request.lessonId);
 if (!request.exerciseId.startsWith(`${lesson.exercise.id}-p`)) throw new Error("Unknown preview exercise");
  const result = evaluateMockExercise(request);
 const sessionKey = `${request.language}/${request.lessonId}`;
 const attemptNumber = (previewAttempts.get(request.exerciseId) ?? 0) + 1;
 previewAttempts.set(request.exerciseId, attemptNumber);
 const resolved = previewResolved.get(sessionKey) ?? new Set<string>();
 const advanceRequired = result.correct || attemptNumber >= 3;
 if (advanceRequired) resolved.add(request.exerciseId);
 previewResolved.set(sessionKey, resolved);
 const before = readStreak();
 let after = before;
 if (resolved.size >= 10) {
 const done = completed.get(request.language) ?? new Set<string>();
 const firstCompletion = !done.has(request.lessonId);
 done.add(request.lessonId); completed.set(request.language, done);
 if (firstCompletion && before.lastDate !== todayKey()) {
   const current = before.lastDate && daysBetween(before.lastDate, todayKey()) === 1 ? before.current + 1 : 1;
   after = {current, longest: Math.max(before.longest, current), lastDate: todayKey()};
   saveStreak(after);
 }
 }
 return {...result, xpAwarded: 0, attemptNumber, advanceRequired, correctAnswer: !result.correct && advanceRequired ? result.feedback.message : null, problemsResolved: resolved.size, totalProblems: 10, progress: {...result.progress, lessonCompleted: resolved.size >= 10}, streak: {previous: before.current, current: after.current, increased: after.current > before.current}, feedback: {...result.feedback, message: result.feedback.message + " Today's streak is saved on this device after all ten problems are complete."}};
}
