import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import type { PathLessonNode } from "../../types/lesson";
import { LessonTopicIcon } from "../../lib/icons";
import { getLessonSyntaxTag } from "../../lib/syntaxTags";

interface LessonNodeProps {
  lesson: PathLessonNode;
  offsetClass: string;
}

export const LessonNode: React.FC<LessonNodeProps> = ({ lesson, offsetClass }) => {
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";

  const syntaxTag = getLessonSyntaxTag(lesson.id);

  const nodeContent = (
    <div className={`relative flex flex-col items-center select-none ${offsetClass}`}>
      {/* Crown or Status Tooltip for Current Node */}
      {isCurrent && (
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mb-2 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/30 flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>START</span>
        </motion.div>
      )}

      {/* Circular Node Button */}
      <motion.div
        whileHover={!isLocked ? { scale: 1.08 } : undefined}
        whileTap={!isLocked ? { scale: 0.95 } : undefined}
        className={`relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-full transition-all ${
          isCurrent
            ? "bg-red-600 border-4 border-white dark:border-slate-900 ring-4 ring-red-500/40 text-white shadow-xl shadow-red-500/30 cursor-pointer"
            : isCompleted
            ? "bg-emerald-500 border-4 border-white dark:border-slate-900 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 cursor-pointer"
            : "bg-slate-200 dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-inner"
        }`}
      >
        {/* Pulsing ring for current node */}
        {isCurrent && (
          <span className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none" />
        )}

        {/* Lesson Topic Dedicated Icon */}
        <LessonTopicIcon lessonId={lesson.id} className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.3]" />

        {/* Top-Right Badge: Checkmark for Completed */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        )}

        {/* Lock Overlay for Locked Nodes */}
        {isLocked && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-slate-900/20 dark:bg-slate-950/40">
            <Lock className="w-5 h-5 stroke-[2.5] text-slate-500 dark:text-slate-400" />
          </div>
        )}
      </motion.div>

      {/* Lesson Title, Topic & Syntax Tag */}
      <div className="mt-3 text-center max-w-[150px] flex flex-col items-center">
        <div className="flex items-center gap-1 mb-1">
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
            {syntaxTag}
          </span>
        </div>
        <div
          className={`text-sm font-bold leading-tight ${
            isCurrent
              ? "text-red-600 dark:text-red-400 font-extrabold"
              : isCompleted
              ? "text-slate-800 dark:text-slate-100"
              : "text-slate-400 dark:text-slate-500 font-medium"
          }`}
        >
          {lesson.title}
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 capitalize truncate mt-0.5 max-w-[140px]">
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

