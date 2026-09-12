import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { getStreakTier } from "../../lib/streak";
import { useOnboarding } from "../../context/OnboardingContext";
import { uiText } from "../../lib/i18n";

interface StreakBadgeProps {
  streak: number;
  increased?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, increased }) => {
  const tier = getStreakTier(streak);
  const surface = `${tier.color}16`;
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold shadow-xs select-none transition-colors"
      style={{ backgroundColor: surface, borderColor: `${tier.color}55`, color: tier.color }}
      animate={
        increased
          ? {
              scale: [1, 1.25, 0.95, 1.1, 1],
              rotate: [0, -5, 5, -3, 0],
              boxShadow: [
                "0 0 0 rgba(249, 115, 22, 0)",
                "0 0 20px rgba(249, 115, 22, 0.6)",
                "0 0 0 rgba(249, 115, 22, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
      title={`${streak} day streak · ${tier.label}`}
    >
      <motion.div
        animate={
          increased
            ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }
            : { scale: [1, 1.06, 1] }
        }
        transition={{
          duration: increased ? 0.6 : 2,
          repeat: increased ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame className="w-5 h-5 drop-shadow-xs" style={{ fill: tier.color, color: tier.color }} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={streak}
          initial={increased ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-base font-extrabold tracking-tight"
        >
          {streak}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export function StreakScale({ current }: { current: number }) {
  const { state } = useOnboarding();
  const days = uiText(state.uiLanguage, "days");
  const tiers = [
    { min: 0, max: 0, label: `0 ${days}`, color: "#64748B" },
    { min: 1, max: 49, label: `1–49 ${days}`, color: "#F97316" },
    { min: 50, max: 99, label: `50–99 ${days}`, color: "#0284C7" },
    { min: 100, max: 249, label: `100–249 ${days}`, color: "#7C3AED" },
    { min: 250, max: 499, label: `250–499 ${days}`, color: "#EAB308" },
    { min: 500, max: Infinity, label: `500+ ${days}`, color: "#DB2777" },
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/80" aria-label="Learning streak colors">
    <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider">{uiText(state.uiLanguage, "streak")}</p><p className="text-[10px] font-semibold text-slate-500">{state.uiLanguage === "fr" ? "Chaque jour compte" : state.uiLanguage === "es" ? "Cada día cuenta" : "Every day counts"}</p></div><strong className="text-sm">{current} {days}</strong></div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">{tiers.map(t => {
      const active = current >= t.min && current <= t.max;
      return <div key={t.label} className={`rounded-xl border p-2 text-center ${active ? "ring-2 ring-offset-1 dark:ring-offset-slate-800" : "border-slate-200 dark:border-slate-700"}`} style={active ? { borderColor: t.color, boxShadow: `0 0 0 2px ${t.color}44` } : undefined}>
        <Flame className="mx-auto h-5 w-5" style={{ color: t.color, fill: t.color }} /><span className="mt-1 block text-[9px] font-black">{t.label}</span>
      </div>;
    })}</div>
  </section>;
}
