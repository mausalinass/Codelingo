import React from "react";
import { Calculator, Delete, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface MathExerciseProps {
  prompt: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  choices?: string[];
  placeholder?: string;
  mathVisual?: {
    type: "fraction_pie" | "grid_array" | "equation" | "geometry_shape";
    title?: string;
    value?: string | number;
    numerator?: number;
    denominator?: number;
    rows?: number;
    cols?: number;
    shape?: "triangle" | "rectangle" | "circle";
    dimensions?: string;
  };
}

export const MathExercise: React.FC<MathExerciseProps> = ({
  prompt,
  value,
  onChange,
  disabled = false,
  hasError = false,
  choices = [],
  placeholder = "Enter your answer...",
  mathVisual,
}) => {
  // Keypad press handler
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    if (key === "BACKSPACE") {
      onChange(value.slice(0, -1));
    } else if (key === "CLEAR") {
      onChange("");
    } else {
      onChange(value + key);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Exercise Instructions & Visual Aid Card */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span>Math Challenge</span>
          </div>
          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Problem Prompt */}
        <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {prompt}
        </div>

        {/* Visual Math Diagrams (Fractions, Grid Arrays, Geometry) */}
        {mathVisual && (
          <div className="py-2 flex flex-col items-center justify-center">
            {/* Grid Array (for Multiplication) */}
            {mathVisual.type === "grid_array" && mathVisual.rows && mathVisual.cols && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                  {mathVisual.rows} rows × {mathVisual.cols} columns
                </span>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${mathVisual.cols}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: mathVisual.rows * mathVisual.cols }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-2xs flex items-center justify-center text-white text-[10px] font-bold"
                    >
                      •
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Fraction Pie Model */}
            {mathVisual.type === "fraction_pie" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 transition-all"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)`,
                    }}
                  />
                  <span className="relative z-10 font-black text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded-md shadow-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
                    {mathVisual.numerator || 3}/{mathVisual.denominator || 4}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Fraction Part
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {mathVisual.title || "Identify the fractional value"}
                  </span>
                </div>
              </div>
            )}

            {/* Geometry Shape (Rectangle / Triangle) */}
            {mathVisual.type === "geometry_shape" && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center gap-2">
                <div className="relative w-40 h-24 rounded-xl border-3 border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 flex items-center justify-center">
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                    {mathVisual.dimensions || "Width: 8 • Height: 5"}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {mathVisual.title || "Calculate Area: W × H"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer Display Screen */}
      <div className="flex flex-col gap-2">
        <div
          className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
            hasError
              ? "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
          }`}
        >
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
            Your Answer:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-slate-900 dark:text-white">
              {value ? value : <span className="text-slate-300 dark:text-slate-600 font-sans text-lg">{placeholder}</span>}
            </span>
            <span className="w-0.5 h-6 bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Quick Choice Tokens (if available) */}
      {choices && choices.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
            Suggested Options
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => onChange(choice)}
                disabled={disabled}
                className={`py-3 px-4 rounded-xl font-black text-base border-2 shadow-xs border-b-4 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer ${
                  value === choice
                    ? "bg-emerald-600 border-emerald-700 text-white shadow-emerald-600/30"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-emerald-400"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Tactile Numeric Keypad */}
      <div className="flex flex-col gap-2 max-w-sm mx-auto w-full">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
          Numeric Keypad
        </span>
        <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-inner">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "BACKSPACE"].map((key) => {
            const isBackspace = key === "BACKSPACE";
            return (
              <motion.button
                key={key}
                whileTap={!disabled ? { scale: 0.94 } : undefined}
                type="button"
                onClick={() => handleKeyPress(key)}
                disabled={disabled}
                className={`py-3 sm:py-3.5 rounded-xl font-black text-lg transition-all flex items-center justify-center shadow-xs border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer focus:outline-hidden ${
                  isBackspace
                    ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-800"
                    : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                }`}
              >
                {isBackspace ? <Delete className="w-5 h-5" /> : key}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
