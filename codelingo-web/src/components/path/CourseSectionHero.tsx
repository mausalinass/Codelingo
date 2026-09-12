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

  return (
    <section className="relative isolate min-h-48 overflow-hidden rounded-3xl border border-blue-900/40 bg-[radial-gradient(circle_at_80%_20%,#173765_0%,#0b1d3b_38%,#061127_100%)] px-6 py-7 text-white shadow-xl sm:px-9">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative z-10 max-w-[64%] sm:max-w-[70%]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">{meta.label} · {uiText(state.uiLanguage, "learnPath")}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{meta.label} {uiText(state.uiLanguage, "mastery")}</h2>
        <p className="mt-2 text-sm font-bold text-blue-100">{percentage}% {uiText(state.uiLanguage, "completed")} · {completed} / {total} {uiText(state.uiLanguage, "lessons")}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
          <LanguageTrackIcon languageId={language} className="h-6 w-6" />
          <span className="text-sm font-extrabold">{phrase}</span>
        </div>
      </div>
      <img src="/louis-pointing-2_5d.png" alt={`Louis presenting the ${meta.label} learning path`} className="louis-idle absolute -bottom-7 right-0 h-52 w-52 object-contain drop-shadow-2xl sm:right-3 sm:h-60 sm:w-60" />
    </section>
  );
}
