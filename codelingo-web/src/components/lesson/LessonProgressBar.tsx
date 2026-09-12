import React from "react";
import { Link } from "react-router-dom";
import { X, Heart } from "lucide-react";

interface LessonProgressBarProps {
  progressPercentage: number;
  lives?: number;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  progressPercentage,
  lives = 5,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-2 select-none">
      {/* Exit Button back to /learn */}
      <Link
        to="/learn"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-hidden"
        title="Exit lesson"
        aria-label="Exit lesson"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </Link>

      {/* Duolingo-style Chunky Progress Bar */}
      <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${Math.max(8, Math.min(100, progressPercentage))}%` }}
        >
          {/* Subtle shine on bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mt-0.5" />
        </div>
      </div>

      {/* Gamified Health / Hearts */}
      <div className="flex items-center gap-1.5 text-red-500 font-black text-sm">
        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        <span>{lives}</span>
      </div>
    </div>
  );
};
