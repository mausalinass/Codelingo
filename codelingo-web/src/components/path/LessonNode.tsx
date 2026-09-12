import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import type { PathLessonNode } from "../../types/lesson";

interface LessonNodeProps {
  lesson: PathLessonNode;
  offsetClass: string;
}

export const LessonNode: React.FC<LessonNodeProps> = ({ lesson, offsetClass }) => {
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";

  const nodeContent = (
    <div className={`relative flex flex-col items-center select-none ${offsetClass}`}>
      {/* Crown or Status Tooltip for Current Node */}
      {isCurrent && (
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mb-2 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/30 flex items-center gap-1"
        >
          <span>START</span>
        </motion.div>
      )}

      {/* Circular Node Button */}
      <motion.div
        whileHover={!isLocked ? { scale: 1.08 } : undefined}
        whileTap={!isLocked ? { scale: 0.95 } : undefined}
        className={`relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-full transition-all ${
          isCurrent
            ? "bg-red-600 border-4 border-white ring-4 ring-red-500/40 text-white shadow-xl shadow-red-500/30 cursor-pointer"
            : isCompleted
            ? "bg-emerald-500 border-4 border-white text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 cursor-pointer"
            : "bg-slate-200 border-4 border-slate-100 text-slate-400 cursor-not-allowed shadow-inner"
        }`}
      >
        {/* Pulsing ring for current node */}
        {isCurrent && (
          <span className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none" />
        )}

        {/* Inner Icon */}
        {isCompleted ? (
          <Check className="w-9 h-9 stroke-[3]" />
        ) : isCurrent ? (
          <Star className="w-9 h-9 fill-white stroke-[2.5]" />
        ) : (
          <Lock className="w-7 h-7 stroke-[2.5]" />
        )}
      </motion.div>

      {/* Lesson Title & Topic */}
      <div className="mt-3 text-center max-w-[140px]">
        <div
          className={`text-sm font-bold leading-tight ${
            isCurrent
              ? "text-red-600 font-extrabold"
              : isCompleted
              ? "text-slate-800"
              : "text-slate-400 font-medium"
          }`}
        >
          {lesson.title}
        </div>
        <div className="text-[11px] text-slate-400 capitalize truncate mt-0.5">
          {lesson.description}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div aria-disabled="true" className="opacity-70 pointer-events-none">
        {nodeContent}
      </div>
    );
  }

  return (
    <Link
      to={`/lesson/${lesson.language}/${lesson.id}`}
      className="focus:outline-hidden group"
      title={`Open ${lesson.title}`}
    >
      {nodeContent}
    </Link>
  );
};
