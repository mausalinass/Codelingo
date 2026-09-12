import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useOnboarding, type UiLanguage } from "../../context/OnboardingContext";
import { CountryFlag } from "../../lib/icons";
import { UI_LOCALES, uiText } from "../../lib/i18n";

export function InterfaceLanguageSelector() {
  const { state, update } = useOnboarding();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = UI_LOCALES.find((locale) => locale.id === state.uiLanguage) ?? UI_LOCALES[0];

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (id: UiLanguage) => {
    update({ uiLanguage: id });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={uiText(state.uiLanguage, "explanationLanguage")}
        onClick={() => setOpen((value) => !value)}
        className="flex min-w-32 items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-xs font-black shadow-sm transition hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800"
      >
        <CountryFlag code={active.flag} className="h-6 w-8" />
        <span className="hidden lg:block">{active.label}</span>
        <ChevronDown className={`ml-auto h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="listbox" aria-label={uiText(state.uiLanguage, "explanationLanguage")} className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:border-slate-800">
            <Languages className="h-4 w-4" /> {uiText(state.uiLanguage, "explanationLanguage")}
          </div>
          <div className="custom-scrollbar mt-1 max-h-80 overflow-y-auto">
            {UI_LOCALES.map((locale) => {
              const selected = locale.id === active.id;
              return (
                <button
                  role="option"
                  aria-selected={selected}
                  type="button"
                  key={locale.id}
                  onClick={() => choose(locale.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-extrabold transition ${selected ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <CountryFlag code={locale.flag} className="h-7 w-10" />
                  <span>{locale.label}</span>
                  {selected && <Check className="ml-auto h-4 w-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
