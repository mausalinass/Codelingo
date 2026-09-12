import React from "react";
import { Brain, Zap, Eye, Sparkles } from "lucide-react";
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
  const traits: Array<{
    id: PersonalityTrait;
    label: string;
    icon: typeof Brain;
    activeStyle: string;
  }> = [
    {
      id: "ANALYTICAL",
      label: "Analytical",
      icon: Brain,
      activeStyle: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
    },
    {
      id: "PRACTICAL",
      label: "Practical",
      icon: Zap,
      activeStyle: "bg-emerald-600 text-white shadow-md shadow-emerald-500/30",
    },
    {
      id: "VISUAL",
      label: "Visual",
      icon: Eye,
      activeStyle: "bg-purple-600 text-white shadow-md shadow-purple-500/30",
    },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Demo Tool Header / Tag */}
      <div className="flex items-center gap-2 select-none">
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
          DEMO
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Swell Profile Switcher</span>
        </div>
      </div>

      {/* Segmented Button Group */}
      <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700/60 w-full sm:w-auto">
        {traits.map((t) => {
          const isSelected = currentTrait === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectTrait(t.id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isSelected
                  ? t.activeStyle
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
