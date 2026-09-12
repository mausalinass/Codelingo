import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart3, Braces, Check, Sprout, Trophy } from "lucide-react";
import { useOnboarding, type ExperienceLevel, type ProgrammingTrack, type UiLanguage } from "../context/OnboardingContext";
import { LouisPrompt, OnboardingShell, primaryButton } from "../components/onboarding/OnboardingShell";
import { placementQuestions, recommendation } from "../lib/placement";
import { DEMO_USER_ID, SUPPORTED_LANGUAGES } from "../lib/constants";
import { LanguageTrackIcon } from "../lib/icons";
import { StreakScale } from "../components/gamification/StreakBadge";
import { completeOnboarding, saveOnboardingPreferences, savePlacement } from "../api/onboarding";

const optionClass = (selected: boolean) => `relative rounded-2xl border-2 p-5 text-left font-bold transition ${selected ? "border-red-600 bg-red-50 dark:bg-red-950/30" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400"}`;
const isSpanish = (language: UiLanguage | null) => language === "es";

export function LanguageStep() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();
  const options: { id: UiLanguage; flag: string; label: string; detail: string }[] = [
    { id: "es", flag: "🇪🇸", label: "Español", detail: "Explicaciones y ayuda en español" },
    { id: "en", flag: "🇺🇸", label: "English", detail: "Lessons and help in English" },
  ];
  return <OnboardingShell step={1} backTo="/">
    <LouisPrompt>¿En qué idioma quieres recibir las explicaciones?</LouisPrompt>
    <p className="mb-2 text-center text-sm font-black uppercase tracking-wider text-slate-500">01 · Tu idioma</p>
    <h1 className="mb-8 text-center text-3xl font-black sm:text-4xl">Choose your explanation language</h1>
    <div className="grid gap-4 sm:grid-cols-2">{options.map(o => <button key={o.id} onClick={() => update({ uiLanguage: o.id })} className={`${optionClass(state.uiLanguage === o.id)} flex items-center gap-4`}><span className="text-4xl" aria-hidden="true">{o.flag}</span><span><span className="text-xl">{o.label}</span><span className="mt-1 block text-sm text-slate-500">{o.detail}</span></span>{state.uiLanguage === o.id && <Check className="absolute right-4 top-4 text-red-600" />}</button>)}</div>
    <button disabled={!state.uiLanguage} onClick={() => navigate("/onboarding/track")} className={`${primaryButton} mt-8`}>{state.uiLanguage === "es" ? "CONTINUAR" : "CONTINUE"}</button>
  </OnboardingShell>;
}

export function TrackStep() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();
  const tracks: ProgrammingTrack[] = ["python", "javascript", "typescript", "csharp"];
  if (!state.uiLanguage) return <Navigate to="/onboarding/language" replace />;
  const es = isSpanish(state.uiLanguage);
  return <OnboardingShell step={2} backTo="/onboarding/language">
    <LouisPrompt>{es ? "¿Qué quieres programar primero?" : "What do you want to program first?"}</LouisPrompt>
    <p className="mb-2 text-center text-sm font-black uppercase tracking-wider text-slate-500">02 · {es ? "Tu lenguaje" : "Your language"}</p>
    <h1 className="mb-8 text-center text-3xl font-black sm:text-4xl">{es ? "¿Qué quieres programar?" : "Choose your programming track"}</h1>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{tracks.map(id => <button key={id} onClick={() => update({ programmingLanguage: id, placementAnswers: {}, placementScore: null, recommendedLessonId: null })} className={`${optionClass(state.programmingLanguage === id)} flex min-h-40 flex-col items-center justify-center text-center`}><LanguageTrackIcon languageId={id} className="mb-3 h-14 w-14" /><span className="text-base sm:text-lg">{SUPPORTED_LANGUAGES[id].label}</span>{state.programmingLanguage === id && <Check className="absolute right-3 top-3 text-red-600" />}</button>)}</div>
    <p className="mt-5 text-center text-sm text-slate-500">{es ? "Podrás cambiar de ruta después. Go, Rust, Java y C++ están disponibles en el dashboard." : "You can change tracks later. Go, Rust, Java and C++ remain available from the dashboard."}</p>
    <button disabled={!state.programmingLanguage} onClick={() => navigate("/onboarding/experience")} className={`${primaryButton} mt-6`}>{es ? "CONTINUAR" : "CONTINUE"}</button>
  </OnboardingShell>;
}

export function ExperienceStep() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();
  if (!state.programmingLanguage) return <Navigate to="/onboarding/track" replace />;
  const es = isSpanish(state.uiLanguage);
  const levels: { id: ExperienceLevel; label: string; detail: string; icon: typeof Sprout }[] = es ? [
    { id: "beginner", label: "Empiezo desde cero", detail: "Nunca he programado antes.", icon: Sprout },
    { id: "basic", label: "Conozco variables y condiciones", detail: "Ya he visto lo básico.", icon: BarChart3 },
    { id: "intermediate", label: "Ya escribo funciones y bucles", detail: "Tengo algo de práctica.", icon: Braces },
    { id: "project_experience", label: "He creado mis propios proyectos", detail: "Me siento cómodo programando.", icon: Trophy },
  ] : [
    { id: "beginner", label: "I'm starting from zero", detail: "I have never programmed before.", icon: Sprout },
    { id: "basic", label: "I know variables and conditions", detail: "I have seen the fundamentals.", icon: BarChart3 },
    { id: "intermediate", label: "I write functions and loops", detail: "I have some programming practice.", icon: Braces },
    { id: "project_experience", label: "I have built my own projects", detail: "I feel comfortable programming.", icon: Trophy },
  ];
  return <OnboardingShell step={3} backTo="/onboarding/track">
    <LouisPrompt>{es ? "¿Cuánto sabes de programación?" : "How much programming do you already know?"}</LouisPrompt>
    <div className="space-y-3">{levels.map(l => <button key={l.id} onClick={() => update({ experienceLevel: l.id })} className={`${optionClass(state.experienceLevel === l.id)} flex w-full items-center gap-4`}><l.icon className="h-8 w-8 text-red-600" /><span><span className="text-lg">{l.label}</span><span className="block text-sm text-slate-500">{l.detail}</span></span>{state.experienceLevel === l.id && <Check className="ml-auto text-red-600" />}</button>)}</div>
    <p className="mt-5 text-sm font-semibold text-slate-500">ⓘ {es ? "Después haremos una prueba breve." : "Next, Louis will give you a short test."}</p>
    <button disabled={!state.experienceLevel} onClick={() => navigate("/onboarding/placement")} className={`${primaryButton} mt-6`}>{es ? "COMENZAR PRUEBA DE 5 PREGUNTAS" : "START THE 5-QUESTION TEST"}</button>
  </OnboardingShell>;
}

export function PlacementStep() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const qs = useMemo(() => state.programmingLanguage ? placementQuestions(state.programmingLanguage) : [], [state.programmingLanguage]);
  if (!state.experienceLevel || !state.programmingLanguage) return <Navigate to="/onboarding/experience" replace />;
  const q = qs[index];
  const es = isSpanish(state.uiLanguage);
  const next = () => { const answers = { ...state.placementAnswers, [q.id]: selected }; update({ placementAnswers: answers }); if (index < qs.length - 1) { setIndex(index + 1); setSelected(answers[qs[index + 1].id] ?? ""); setChecked(false); return; } const score = qs.filter(x => (x.id === q.id ? selected : answers[x.id]) === x.answer).length; update({ placementAnswers: answers, placementScore: score, recommendedLessonId: recommendation(score) }); navigate("/onboarding/result"); };
  return <OnboardingShell step={4} backTo="/onboarding/experience">
    <div className="mb-4 flex items-center justify-between font-bold text-slate-500"><span>{es ? `Pregunta ${index + 1} de 5` : `Question ${index + 1} of 5`}</span><span className="flex items-center gap-2"><LanguageTrackIcon languageId={state.programmingLanguage} className="h-6 w-6" />{SUPPORTED_LANGUAGES[state.programmingLanguage].label}</span></div>
    <LouisPrompt>{es ? "¡Tú puedes! Piénsalo bien." : q.prompt}</LouisPrompt><h1 className="mb-4 text-2xl font-black">{es ? "¿Qué resultado produce este código?" : q.prompt}</h1><pre className="mb-6 overflow-auto rounded-2xl bg-slate-950 p-6 text-lg text-slate-100"><code>{q.code}</code></pre>
    <div className="grid gap-3 sm:grid-cols-2">{q.options.map(o => <button key={o} disabled={checked} onClick={() => setSelected(o)} className={optionClass(selected === o)}>{o}</button>)}</div>{checked && <p role="status" className={`mt-5 rounded-xl p-4 font-bold ${selected === q.answer ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{selected === q.answer ? (es ? "¡Correcto! Louis está impresionado." : "Correct! Louis is impressed.") : (es ? `La respuesta es: ${q.answer}` : `The answer is: ${q.answer}`)}</p>}
    <button disabled={!selected} onClick={() => checked ? next() : setChecked(true)} className={`${primaryButton} mt-7`}>{checked ? (index === 4 ? (es ? "VER MI RESULTADO" : "SEE MY RESULT") : (es ? "SIGUIENTE" : "NEXT")) : (es ? "COMPROBAR" : "CHECK")}</button>
  </OnboardingShell>;
}

export function PlacementResult() {
  const { state, update, reset } = useOnboarding();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  if (state.placementScore === null || !state.programmingLanguage || !state.recommendedLessonId || !state.uiLanguage || !state.experienceLevel) return <Navigate to="/onboarding/placement" replace />;
  const es = isSpanish(state.uiLanguage);
  const titles: Record<string, string> = es ? { hello: "Introducción", variables: "Variables", conditions: "Condiciones", functions: "Funciones" } : { hello: "Hello World", variables: "Variables", conditions: "Conditions", functions: "Functions" };
  const title = titles[state.recommendedLessonId] ?? state.recommendedLessonId;
  const go = async (lesson: string) => { setSaving(true); setError(""); try { await saveOnboardingPreferences(DEMO_USER_ID, state.uiLanguage!, state.programmingLanguage!, state.experienceLevel!); await savePlacement(DEMO_USER_ID, state.programmingLanguage!, state.placementAnswers); await completeOnboarding(DEMO_USER_ID, lesson); update({ completed: true, recommendedLessonId: lesson }); localStorage.setItem("codelingo_active_language", state.programmingLanguage!); localStorage.setItem("codelingo_demo_session", "true"); window.location.assign(`/lesson/${state.programmingLanguage}/${lesson}`); } catch { setError(es ? "No pudimos guardar la recomendación. Verifica que el backend esté activo." : "We could not save the recommendation. Check that the backend is running."); setSaving(false); } };
  return <OnboardingShell step={5} backTo="/onboarding/placement">
    <div className="grid items-center gap-8 md:grid-cols-[300px_1fr]"><div className="text-center"><img src="/louis-transparent.png" className="mx-auto h-72 w-72 object-contain animate-bounce" alt="Louis celebrating" /><p className="rounded-2xl border-2 border-slate-200 bg-white p-4 text-xl font-black dark:border-slate-700 dark:bg-slate-900">{es ? "¡Lo hiciste! Aquí está tu punto de partida." : "You did it! Here is your starting point."}</p></div><section className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-900"><h1 className="text-3xl font-black sm:text-4xl">{es ? "¡Encontramos tu punto de partida!" : "We found your starting point!"}</h1><div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800"><p className="font-bold text-slate-500">{es ? "Recomendación" : "Recommendation"}</p><p className="mt-1 flex items-center gap-3 text-3xl font-black text-red-600"><LanguageTrackIcon languageId={state.programmingLanguage} className="h-12 w-12" />{title} · {SUPPORTED_LANGUAGES[state.programmingLanguage].label}</p><p className="mt-5 rounded-xl bg-white p-3 text-lg font-black dark:bg-slate-900">✓ {state.placementScore} {es ? "de 5 respuestas correctas" : "of 5 correct answers"}</p></div><p className="mt-4 text-slate-600 dark:text-slate-300">{es ? "La prueba recomienda tu inicio; no suma XP ni marca lecciones completadas." : "The test recommends a starting point; it does not award XP or mark lessons complete."}</p>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-red-800">{error}</p>}<button disabled={saving} onClick={() => void go(state.recommendedLessonId!)} className={`${primaryButton} mt-7`}>{saving ? (es ? "GUARDANDO…" : "SAVING…") : `${es ? "EMPEZAR EN" : "START AT"} ${title.toUpperCase()}`}</button><button disabled={saving} onClick={() => void go("hello")} className="mt-3 w-full rounded-2xl border-2 border-slate-200 px-5 py-4 font-black dark:border-slate-700">{es ? "REPASAR DESDE CERO" : "REVIEW FROM THE BEGINNING"}</button><button onClick={() => { reset(); navigate("/onboarding/language"); }} className="mt-3 w-full text-sm font-bold text-slate-500 underline">{es ? "Reiniciar evaluación" : "Restart onboarding"}</button></section></div>
    <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800"><div className="grid items-center gap-6 md:grid-cols-[220px_1fr]"><div><h2 className="text-2xl font-black">{es ? "Louis te acompaña" : "Louis stays with you"}</h2><p className="mt-2 text-slate-500">{es ? "Tu compañero en cada paso del camino." : "Your companion at every step."}</p></div><div className="grid grid-cols-3 gap-3 text-center text-xs font-black"><div><img src="/louis-transparent.png" className="mx-auto h-24 w-24 object-contain" alt="Louis greeting" />{es ? "Te saluda" : "Greets you"}</div><div><img src="/louis-transparent.png" className="mx-auto h-24 w-24 rotate-12 object-contain" alt="Louis flying" />{es ? "Vuela entre secciones" : "Flies between sections"}</div><div><img src="/louis-transparent.png" className="mx-auto h-24 w-24 -rotate-6 object-contain" alt="Louis celebrating" />{es ? "Celebra tus logros" : "Celebrates your wins"}</div></div></div><div className="mt-7"><StreakScale current={0} /></div></section>
  </OnboardingShell>;
}
