import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Eye, Sparkles, CheckCircle2 } from "lucide-react";
import type { PersonalityTrait } from "../../types/api";

interface DemoPersonalitySwitchProps {
  currentTrait: PersonalityTrait;
  onSelectTrait: (trait: PersonalityTrait) => void;
  isLoading?: boolean;
}

export const DemoPersonalitySwitch: React.FC<DemoPersonalitySwitchProps> = ({
  currentTrait,
  onSelectTrait,
  isLoading = false,
}) => {
  const modes: Array<{
    id: PersonalityTrait;
    title: string;
    subtitle: string;
    tag: string;
    icon: typeof Brain;
    activeBorder: string;
    activeBg: string;
    textColor: string;
    badgeBg: string;
  }> = [
    {
      id: "ANALYTICAL",
      title: "Analytical Mode",
      subtitle: "Explanation and coding practice",
      tag: "Code Deep Dive",
      icon: Brain,
      activeBorder: "border-blue-500 ring-2 ring-blue-500/30",
      activeBg: "bg-blue-600 text-white shadow-lg shadow-blue-500/25",
      textColor: "text-blue-600",
      badgeBg: "bg-blue-500 text-white",
    },
    {
      id: "PRACTICAL",
      title: "Practical Mode",
      subtitle: "Hands-on coding practice",
      tag: "Practice First",
      icon: Zap,
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/30",
      activeBg: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      textColor: "text-emerald-600",
      badgeBg: "bg-emerald-500 text-white",
    },
    {
      id: "VISUAL",
      title: "Visual Mode",
      subtitle: "Flowcharts & Logic Gate Diagrams",
      tag: "Visual Guided",
      icon: Eye,
      activeBorder: "border-purple-500 ring-2 ring-purple-500/30",
      activeBg: "bg-purple-600 text-white shadow-lg shadow-purple-500/25",
      textColor: "text-purple-600",
      badgeBg: "bg-purple-500 text-white",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col gap-3.5 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
            LIVE ADAPTATION
          </span>
          <span className="font-extrabold text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Switch Lesson Presentation Type
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Swell demo profile
        </span>
      </div>

      {/* Bigger Buttons for Lesson Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {modes.map((m) => {
          const isSelected = currentTrait === m.id;
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              type="button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTrait(m.id)}
              className={`relative flex items-center sm:flex-col sm:items-start text-left gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${m.activeBg} ${m.activeBorder}`
                  : "bg-slate-800/80 hover:bg-slate-800 border-slate-700/70 text-slate-300 hover:border-slate-600"
              }`}
            >
              {/* Icon & Active Indicator */}
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5] text-white shrink-0 hidden sm:block" />
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base leading-snug tracking-tight">
                    {m.title}
                  </span>
                </div>
                <div
                  className={`text-xs mt-0.5 leading-normal ${
                    isSelected ? "text-white/85" : "text-slate-400"
                  }`}
                >
                  {m.subtitle}
                </div>
              </div>

              {/* Tag Pill */}
              <span
                className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-1 ${
                  isSelected ? "bg-black/25 text-white" : "bg-slate-700 text-slate-400"
                }`}
              >
                {m.tag}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
