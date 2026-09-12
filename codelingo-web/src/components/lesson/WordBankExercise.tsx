import React, { useState, useMemo } from "react";
import { Volume2, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WordBankExerciseProps {
  prompt: string;
  targetSentence?: string;
  wordBank?: string[];
  audioText?: string;
  onChange: (constructedSentence: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export const WordBankExercise: React.FC<WordBankExerciseProps> = ({
  prompt,
  targetSentence,
  wordBank = [],
  audioText,
  onChange,
  disabled = false,
  hasError = false,
}) => {
  // Array of token objects with unique IDs to support duplicate words
  const tokens = useMemo(
    () =>
      wordBank.map((word, idx) => ({
        id: `${word}-${idx}`,
        text: word,
      })),
    [wordBank]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Handle playing audio pronunciation
  const handlePlayAudio = () => {
    const textToSpeak = audioText || targetSentence || prompt;
    if ("speechSynthesis" in window && textToSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      // Attempt language detection heuristics
      if (/[\u0600-\u06ff]/i.test(textToSpeak)) utterance.lang = "ar-SA";
      else if (/[\u0400-\u04ff]/i.test(textToSpeak)) utterance.lang = "ru-RU";
      else if (/[\uac00-\ud7af]/i.test(textToSpeak)) utterance.lang = "ko-KR";
      else if (/[\u4e00-\u9fa5]/i.test(textToSpeak)) utterance.lang = "zh-CN";
      else if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/i.test(textToSpeak)) utterance.lang = "ja-JP";
      else if (/[ãõçê]/i.test(textToSpeak)) utterance.lang = "pt-BR";
      else if (/[áéíóúñ¿¡]/i.test(textToSpeak)) utterance.lang = "es-ES";
      else if (/[àâçéèêëîïôûùüÿœæ]/i.test(textToSpeak)) utterance.lang = "fr-FR";
      else if (/[äöüß]/i.test(textToSpeak)) utterance.lang = "de-DE";
      else if (/[àèéìíîòóùú]/i.test(textToSpeak)) utterance.lang = "it-IT";
      else utterance.lang = "en-US";

      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add word from bank to sentence
  const handleSelectWord = (id: string) => {
    if (disabled || selectedIds.includes(id)) return;
    const nextSelected = [...selectedIds, id];
    setSelectedIds(nextSelected);

    const sentence = nextSelected
      .map((sid) => tokens.find((t) => t.id === sid)?.text || "")
      .join(" ");
    onChange(sentence);
  };

  // Remove word from sentence back to bank
  const handleDeselectWord = (id: string) => {
    if (disabled) return;
    const nextSelected = selectedIds.filter((sid) => sid !== id);
    setSelectedIds(nextSelected);

    const sentence = nextSelected
      .map((sid) => tokens.find((t) => t.id === sid)?.text || "")
      .join(" ");
    onChange(sentence);
  };

  // Clear all
  const handleClearAll = () => {
    if (disabled) return;
    setSelectedIds([]);
    onChange("");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Exercise Instructions & Audio Prompt Card */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Translate this sentence</span>
          </div>

          {selectedIds.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Source Sentence with Speaker Button */}
        <div className="flex items-center gap-3.5 pt-1">
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 ${
              isPlayingAudio
                ? "bg-red-600 text-white ring-4 ring-red-500/30 scale-105"
                : "bg-red-500 hover:bg-red-600 text-white active:scale-95"
            }`}
            title="Listen to pronunciation"
          >
            <Volume2 className={`w-5 h-5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
          </button>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {targetSentence || prompt}
            </span>
            {targetSentence && prompt !== targetSentence && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {prompt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answer Construction Zone (Drop slots) */}
      <div
        className={`min-h-[90px] sm:min-h-[105px] p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all flex flex-wrap items-center gap-2.5 ${
          hasError
            ? "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
            : selectedIds.length > 0
            ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-inner"
            : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40"
        }`}
      >
        <AnimatePresence>
          {selectedIds.length === 0 ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-slate-400 dark:text-slate-500 select-none italic"
            >
              Tap the words below to build your translation...
            </motion.span>
          ) : (
            selectedIds.map((id) => {
              const token = tokens.find((t) => t.id === id);
              if (!token) return null;
              return (
                <motion.button
                  key={id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  type="button"
                  onClick={() => handleDeselectWord(id)}
                  disabled={disabled}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base border-2 border-slate-200 dark:border-slate-700 shadow-xs border-b-4 active:border-b-2 active:translate-y-0.5 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer focus:outline-hidden"
                >
                  {token.text}
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Available Word Bank (Duolingo 3D Chunky Word Chips) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Word Bank
        </span>

        <div className="flex flex-wrap items-center gap-2.5 p-1">
          {tokens.map((token) => {
            const isUsed = selectedIds.includes(token.id);
            return (
              <div key={token.id} className="relative">
                {/* Phantom placeholder to preserve layout slot */}
                {isUsed && (
                  <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-transparent font-extrabold text-sm sm:text-base border border-dashed border-slate-200 dark:border-slate-700/50 select-none">
                    {token.text}
                  </div>
                )}

                {/* Interactive Clickable Word Chip */}
                {!isUsed && (
                  <motion.button
                    whileHover={!disabled ? { scale: 1.04 } : undefined}
                    whileTap={!disabled ? { scale: 0.96 } : undefined}
                    type="button"
                    onClick={() => handleSelectWord(token.id)}
                    disabled={disabled}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm sm:text-base border-2 border-slate-200 dark:border-slate-700 shadow-sm border-b-4 active:border-b-2 active:translate-y-0.5 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer focus:outline-hidden"
                  >
                    {token.text}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
