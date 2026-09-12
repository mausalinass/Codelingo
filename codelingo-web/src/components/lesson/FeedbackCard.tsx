import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import type { SubmitStatus } from "../../types/lesson";

interface FeedbackCardProps {
  status: SubmitStatus;
  feedback?: { title: string; message: string };
  isAnswerEmpty: boolean;
  onCheck: () => void;
  onContinue: () => void;
  onTryAgain: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  status,
  feedback,
  isAnswerEmpty,
  onCheck,
  onContinue,
  onTryAgain,
}) => {
  const isSubmitting = status === "submitting";
  const isCorrect = status === "correct";
  const isIncorrect = status === "incorrect";
  const isError = status === "requestError";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t z-30 transition-colors duration-300 ${
        isCorrect
          ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
          : isIncorrect
          ? "bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
          : isError
          ? "bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <AnimatePresence mode="wait">
          {/* Default / Submitting Bottom Action Bar */}
          {(status === "idle" || status === "submitting") && (
            <motion.div
              key="idle-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="hidden sm:block text-xs font-semibold text-slate-400 dark:text-slate-500">
                Click Check to review your solution
              </div>
              <button
                type="button"
                onClick={onCheck}
                disabled={isAnswerEmpty || isSubmitting}
                className={`ml-auto w-full sm:w-auto min-w-[140px] px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                  isAnswerEmpty || isSubmitting
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/25 ring-2 ring-red-500/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check</span>
                )}
              </button>
            </motion.div>
          )}

          {/* Correct Drawer */}
          {isCorrect && (
            <motion.div
              key="correct-drawer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                  <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-emerald-800 font-black text-lg tracking-tight">
                    {feedback?.title || "Outstanding! 🎉"}
                  </div>
                  <div className="text-emerald-700 font-medium text-sm mt-0.5 leading-relaxed max-w-xl">
                    {feedback?.message || "You completed the challenge perfectly!"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onContinue}
                className="w-full sm:w-auto min-w-[160px] px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </motion.div>
          )}

          {/* Incorrect Drawer */}
          {isIncorrect && (
            <motion.div
              key="incorrect-drawer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                  <AlertCircle className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-rose-800 font-black text-lg tracking-tight">
                    {feedback?.title || "Not quite yet 💡"}
                  </div>
                  <div className="text-rose-700 font-medium text-sm mt-0.5 leading-relaxed max-w-xl">
                    {feedback?.message || "Check your answer and try again."}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onTryAgain}
                className="w-full sm:w-auto min-w-[160px] px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all active:scale-98 cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Error Drawer */}
          {isError && (
            <motion.div
              key="error-drawer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertCircle className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="text-amber-900 font-black text-lg">
                    Could not check your answer
                  </div>
                  <div className="text-amber-800 font-medium text-sm">
                    Preserved your typed answer. Click retry to re-evaluate.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onCheck}
                className="w-full sm:w-auto min-w-[140px] px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-700 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Retry Check
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
