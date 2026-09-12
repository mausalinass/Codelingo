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
  // Variations based on mood
  const isCelebrating = mood === "celebrating";
  const isThinking = mood === "thinking";
  const isEncouraging = mood === "encouraging";

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20 sm:w-24 sm:h-24",
    lg: "w-28 h-28 sm:w-32 sm:h-32",
  };

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* Louis Mascot Illustration */}
      <motion.div
        className={`shrink-0 ${sizeClasses[size]} relative select-none`}
        animate={
          isCelebrating
            ? {
                y: [0, -14, 0, -8, 0],
                rotate: [0, -6, 6, -3, 0],
                scale: [1, 1.15, 1.05, 1.1, 1],
              }
            : isThinking
            ? {
                rotate: [0, 4, 0],
                y: [0, -2, 0],
              }
            : isEncouraging
            ? {
                scale: [1, 1.05, 1],
                y: [0, -4, 0],
              }
            : {
                y: [0, -3, 0],
              }
        }
        transition={{
          duration: isCelebrating ? 0.7 : 2.5,
          repeat: isCelebrating ? 2 : Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
          aria-label="Louis the Codelingo Coach"
        >
          {/* Celebrating Confetti sparkles around Louis */}
          {isCelebrating && (
            <g>
              <circle cx="15" cy="15" r="3" fill="#F59E0B" />
              <polygon points="85,12 88,18 94,18 89,22 91,28 85,24 79,28 81,22 76,18 82,18" fill="#EF4444" />
              <circle cx="88" cy="80" r="3.5" fill="#10B981" />
              <circle cx="10" cy="70" r="2.5" fill="#6366F1" />
            </g>
          )}

          {/* Thinking lightbulb / question marks */}
          {isThinking && (
            <g className="animate-pulse">
              <text x="76" y="24" fontSize="16" fontWeight="bold" fill="#3B82F6">?</text>
              <text x="86" y="14" fontSize="12" fontWeight="bold" fill="#9333EA">💡</text>
            </g>
          )}

          {/* Owl Body - Vibrant Louis Red */}
          <path
            d="M 50 15 C 28 15 20 32 20 60 C 20 82 32 88 50 88 C 68 88 80 82 80 60 C 80 32 72 15 50 15 Z"
            fill="#E52E2E"
          />

          {/* Belly patch */}
          <path
            d="M 50 45 C 38 45 34 56 34 72 C 34 84 42 86 50 86 C 58 86 66 84 66 72 C 66 56 62 45 50 45 Z"
            fill="#FEE2E2"
          />

          {/* Feather tufts on ears */}
          <polygon points="30,16 22,2 38,18" fill="#B91C1C" />
          <polygon points="70,16 78,2 62,18" fill="#B91C1C" />

          {/* Glasses Frame (Coder Louis signature!) */}
          <circle cx="38" cy="38" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
          <circle cx="62" cy="38" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
          <line x1="52" y1="38" x2="48" y2="38" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

          {/* Pupils with mood states */}
          {isCelebrating ? (
            // Happy closed crescent eyes
            <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 32 38 Q 38 32 44 38" />
              <path d="M 56 38 Q 62 32 68 38" />
            </g>
          ) : isThinking ? (
            // Inquisitive eyes looking up and to the side
            <g fill="#0F172A">
              <circle cx="40" cy="34" r="5" />
              <circle cx="64" cy="34" r="5" />
              <circle cx="42" cy="32" r="1.5" fill="#FFFFFF" />
              <circle cx="66" cy="32" r="1.5" fill="#FFFFFF" />
            </g>
          ) : (
            // Attentive front-facing eyes
            <g fill="#0F172A">
              <circle cx="38" cy="38" r="5.5" />
              <circle cx="62" cy="38" r="5.5" />
              <circle cx="40" cy="36" r="1.8" fill="#FFFFFF" />
              <circle cx="64" cy="36" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Orange Beak */}
          <polygon
            points="50,44 43,52 57,52"
            fill="#F97316"
            stroke="#C2410C"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Cheeks - blushing for celebrating / friendly */}
          <ellipse cx="28" cy="48" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.8" />
          <ellipse cx="72" cy="48" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.8" />

          {/* Wings */}
          {isCelebrating ? (
            // Raised wings in victory
            <g fill="#DC2626">
              <path d="M 22 55 Q 8 38 12 28 Q 20 40 24 48 Z" />
              <path d="M 78 55 Q 92 38 88 28 Q 80 40 76 48 Z" />
            </g>
          ) : (
            // Relaxed side wings
            <g fill="#DC2626">
              <path d="M 21 48 Q 12 60 22 74 Q 25 65 24 52 Z" />
              <path d="M 79 48 Q 88 60 78 74 Q 75 65 76 52 Z" />
            </g>
          )}

          {/* Small feet */}
          <ellipse cx="42" cy="88" rx="5" ry="3" fill="#EA580C" />
          <ellipse cx="58" cy="88" rx="5" ry="3" fill="#EA580C" />
        </svg>
      </motion.div>

      {/* Dynamic Speech Bubble */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs"
      >
        {/* Pointer arrow to Louis */}
        <div className="absolute -left-2 top-5 w-3.5 h-3.5 bg-white border-l border-b border-slate-200 rotate-45 transform" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              Louis Coach
            </span>
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
