import React, { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Flame, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { LouisCoach } from "../components/louis/LouisCoach";

interface CompleteLocationState {
  preview?: boolean;
  language?: string;
  lessonTitle?: string;
  xpAwarded?: number;
  newStreak?: number;
}

export const CompletePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as CompleteLocationState) || {};

  const xpAwarded = state.xpAwarded ?? 0;
  const newStreak = state.newStreak ?? 0;
  const lessonTitle = state.lessonTitle ?? "Lesson";

  useEffect(() => {
    // Grand celebration fireworks
    const end = Date.now() + 1.2 * 1000;
    const colors = ["#E52E2E", "#58CC02", "#FF9600", "#3B82F6"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  if (state.xpAwarded === undefined || state.newStreak === undefined) return <Navigate to="/learn" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100 selection:bg-red-500 selection:text-white transition-colors">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
        {/* Giant Louis Coach Mascot in Celebrating Mood */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <LouisCoach
            mood="celebrating"
            size="lg"
            message={state.preview ? "Preview practice complete. No account progress, XP or streak changes were saved." : "Nice work! Your saved lesson results are below."}
          />
        </motion.div>

        {/* Milestone Title */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" /> Lesson Complete
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {lessonTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            You just crushed this milestone in your personalized learning track!
          </p>
        </motion.div>

        {/* Reward Stat Cards: Streak and XP Payoff */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Streak Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-200 dark:border-orange-800/80 flex flex-col items-center shadow-xs"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Flame className="w-8 h-8 fill-orange-500 text-orange-500 mb-1" />
            </motion.div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
              {newStreak} {newStreak === 1 ? "DAY" : "DAYS"}
            </div>
            <div className="text-[11px] font-bold text-orange-700/80 dark:text-orange-300/80 uppercase tracking-wide">
              Daily Streak 🔥
            </div>
          </motion.div>

          {/* XP Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/80 flex flex-col items-center shadow-xs"
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Zap className="w-8 h-8 fill-amber-500 text-amber-500 mb-1" />
            </motion.div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              +{xpAwarded} XP
            </div>
            <div className="text-[11px] font-bold text-amber-700/80 dark:text-amber-300/80 uppercase tracking-wide">
              Earned Points ⚡
            </div>
          </motion.div>
        </div>

        {/* Return Button */}
        <motion.button
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          type="button"
          onClick={() => navigate("/learn")}
          className="w-full py-4 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-red-500/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
};
