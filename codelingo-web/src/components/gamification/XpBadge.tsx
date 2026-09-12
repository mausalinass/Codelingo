import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface XpBadgeProps {
  xp: number;
  highlighted?: boolean;
}

export const XpBadge: React.FC<XpBadgeProps> = ({ xp, highlighted }) => {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 font-bold shadow-xs select-none transition-colors"
      animate={
        highlighted
          ? {
              scale: [1, 1.25, 0.95, 1.08, 1],
              boxShadow: [
                "0 0 0 rgba(245, 158, 11, 0)",
                "0 0 16px rgba(245, 158, 11, 0.6)",
                "0 0 0 rgba(245, 158, 11, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
      title={`${xp} total XP`}
    >
      <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
      <AnimatePresence mode="wait">
        <motion.span
          key={xp}
          initial={highlighted ? { y: -8, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          className="text-base font-extrabold tracking-tight text-amber-800 dark:text-amber-300"
        >
          {xp} XP
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};
