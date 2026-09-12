import type { LanguageId } from "../../types/api";
import { SUPPORTED_LANGUAGES } from "../../lib/constants";
import { LanguageTrackIcon } from "../../lib/icons";
import { useOnboarding } from "../../context/OnboardingContext";
import { uiText } from "../../lib/i18n";

interface Props {
  language: LanguageId;
  percentage: number;
  completed: number;
  total: number;
}

const phraseBySubject = {
  coding: { en: "Small steps. Big developers.", es: "Pequeños pasos. Grandes developers.", fr: "Petits pas. Grands développeurs." },
  language: { en: "One new phrase at a time.", es: "Una frase nueva a la vez.", fr: "Une nouvelle phrase à la fois." },
  math: { en: "Think it through. You can solve it.", es: "Piénsalo bien. Puedes resolverlo.", fr: "Réfléchis bien. Tu peux le résoudre." },
} as const;

export function CourseSectionHero({ language, percentage, completed, total }: Props) {
  const { state } = useOnboarding();
  const meta = SUPPORTED_LANGUAGES[language];
  const locale = state.uiLanguage === "es" || state.uiLanguage === "fr" ? state.uiLanguage : "en";
  const phrase = phraseBySubject[meta.subject][locale];
  const louisImages = ["/louis-pointing-2_5d.png", "/louis-celebrating-2_5d.png", "/louis-thinking-2_5d.png"];
  const louisImage = louisImages[[...language].reduce((sum, character) => sum + character.charCodeAt(0), 0) % louisImages.length];

  return (
    <section className="relative isolate min-h-48 overflow-hidden rounded-3xl border border-sky-200 bg-[radial-gradient(circle_at_80%_20%,#dbeafe_0%,#eff6ff_42%,#ffffff_100%)] px-6 py-7 text-slate-950 shadow-xl transition-colors dark:border-blue-900/40 dark:bg-[radial-gradient(circle_at_80%_20%,#173765_0%,#0b1d3b_38%,#061127_100%)] dark:text-white sm:px-9">
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(15,23,42,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.05)_1px,transparent_1px)] [background-size:28px_28px] dark:opacity-30 dark:[background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)]" />
      <div className="relative z-10 max-w-[64%] sm:max-w-[70%]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700 dark:text-blue-200">{meta.label} · {uiText(state.uiLanguage, "learnPath")}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{meta.label} {uiText(state.uiLanguage, "mastery")}</h2>
        <p className="mt-2 text-sm font-bold text-slate-600 dark:text-blue-100">{percentage}% {uiText(state.uiLanguage, "completed")} · {completed} / {total} {uiText(state.uiLanguage, "lessons")}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white/75 px-3 py-2 backdrop-blur dark:border-white/15 dark:bg-white/10">
          <LanguageTrackIcon languageId={language} className="h-6 w-6" />
          <span className="text-sm font-extrabold">{phrase}</span>
        </div>
      </div>
      <img src={louisImage} alt={`Louis presenting the ${meta.label} learning path`} className="louis-idle absolute -bottom-7 right-0 h-52 w-52 object-contain drop-shadow-2xl sm:right-3 sm:h-60 sm:w-60" />
    </section>
  );
}
