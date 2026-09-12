import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, Eye } from "lucide-react";
import type { LearningMode, PersonalityTrait } from "../../types/api";

interface PersonalityBadgeProps {
  trait: PersonalityTrait;
  mode: LearningMode;
  source?: string;
  score?: number;
  className?: string;
}

export const PersonalityBadge: React.FC<PersonalityBadgeProps> = ({
  trait,
  mode,
  source = "SWELL_MOCK",
  score = 0,
  className = "",
}) => {
  const getTraitConfig = (t: PersonalityTrait) => {
    switch (t) {
      case "ANALYTICAL":
        return {
          icon: Brain,
          label: "Analytical",
          color: "border-blue-200 bg-blue-50/70 text-blue-700",
          badgeBg: "bg-blue-600 text-white",
          dotColor: "bg-blue-500",
          modeLabel: "Deep Explanation Mode",
          accentColor: "#2563EB",
        };
      case "PRACTICAL":
        return {
          icon: Zap,
          label: "Practical",
          color: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
          badgeBg: "bg-emerald-600 text-white",
          dotColor: "bg-emerald-500",
          modeLabel: "Practice First Mode",
          accentColor: "#059669",
        };
      case "VISUAL":
        return {
          icon: Eye,
          label: "Visual",
          color: "border-purple-200 bg-purple-50/70 text-purple-700",
          badgeBg: "bg-purple-600 text-white",
          dotColor: "bg-purple-500",
          modeLabel: "Visual Guided Mode",
          accentColor: "#7C3AED",
        };
    }
  };

  const config = getTraitConfig(trait);
  const IconComponent = config.icon;

  return (
    <motion.div
      key={trait}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border px-3.5 py-2.5 shadow-xs ${config.color} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Trait Tag */}
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-xl ${config.badgeBg} shadow-2xs`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">
                {config.label} Learner
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/80 border border-current/10">
                {Math.round(score * 100)}% fit
              </span>
            </div>
            <div className="text-[11px] font-medium opacity-85 capitalize">
              {mode ? mode.toLowerCase().replace(/_/g, " ") : config.modeLabel}
            </div>
          </div>
        </div>

        {/* Right: Sponsor / Source Proof */}
        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-current/15 text-[10px] font-bold tracking-wider uppercase text-slate-800 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Powered by {source}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
