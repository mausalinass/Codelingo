import React from "react";
import { motion } from "framer-motion";
import type { LouisMood } from "../../types/lesson";

interface LouisCoachProps {
  mood?: LouisMood;
  message: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LouisCoach: React.FC<LouisCoachProps> = ({
  mood = "idle",
  message,
  className = "",
  size = "md",
}) => {
  const isCelebrating = mood === "celebrating";
  const isThinking = mood === "thinking";
  const isEncouraging = mood === "encouraging";

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24 sm:w-28 sm:h-28",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
  };

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* Louis Cardinal Mascot */}
      <motion.div
        className={`shrink-0 ${sizeClasses[size]} relative select-none flex items-center justify-center`}
        animate={
          isCelebrating
            ? {
                y: [0, -16, 0, -10, 0],
                rotate: [0, -6, 6, -3, 0],
                scale: [1, 1.15, 1.05, 1.1, 1],
              }
            : isThinking
            ? {
                rotate: [0, 5, -2, 0],
                y: [0, -3, 0],
              }
            : isEncouraging
            ? {
                scale: [1, 1.06, 1],
                y: [0, -4, 0],
              }
            : {
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: isCelebrating ? 0.7 : 2.6,
          repeat: isCelebrating ? 2 : Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Thinking or Celebrating Overlays */}
        {isCelebrating && (
          <div className="absolute -top-3 -right-2 text-xl sm:text-2xl animate-bounce pointer-events-none z-10">
            🎉
          </div>
        )}
        {isCelebrating && (
          <div className="absolute -top-2 -left-2 text-lg sm:text-xl animate-pulse pointer-events-none z-10">
            ✨
          </div>
        )}
        {isThinking && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-3 -right-1 flex items-center gap-0.5 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-md text-xs font-bold pointer-events-none z-10"
          >
            <span>💡</span>
            <span className="text-blue-600 font-extrabold">?</span>
          </motion.div>
        )}

        {/* Mascot Bird Image */}
        <img
          src="/louis-transparent.png"
          alt="Louis the Cardinal - Codelingo Mascot"
          className="w-full h-full object-contain drop-shadow-md transition-transform"
          draggable="false"
        />
      </motion.div>

      {/* Dynamic Speech Bubble */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-xs"
      >
        {/* Pointer arrow to Louis */}
        <div className="absolute -left-2 top-6 w-3.5 h-3.5 bg-white border-l border-b border-slate-200 rotate-45 transform" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-red-600">
                Louis
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {mood}
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
