export function LouisConnectionStatus() {
  const { state } = useOnboarding();
  return (
    <aside className="fixed bottom-4 right-4 z-30 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95" aria-label="Louis connected">
      <img src="/louis-pointing-2_5d.png" alt="Louis" className="h-11 w-11 object-contain" />
      <div className="pr-2">
        <p className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />{uiText(state.uiLanguage, "connected")}</p>
        <p className="hidden text-[10px] font-semibold text-slate-500 sm:block">{uiText(state.uiLanguage, "companion")}</p>
      </div>
    </aside>
  );
}
import { useOnboarding } from "../../context/OnboardingContext";
import { uiText } from "../../lib/i18n";
