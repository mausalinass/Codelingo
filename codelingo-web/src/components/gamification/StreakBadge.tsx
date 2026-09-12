import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  increased?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, increased }) => {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-bold shadow-xs select-none"
      animate={
        increased
          ? {
              scale: [1, 1.25, 0.95, 1.1, 1],
              rotate: [0, -5, 5, -3, 0],
              boxShadow: [
                "0 0 0 rgba(249, 115, 22, 0)",
                "0 0 20px rgba(249, 115, 22, 0.6)",
                "0 0 0 rgba(249, 115, 22, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
      title={`${streak} day streak`}
    >
      <motion.div
        animate={
          increased
            ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }
            : { scale: [1, 1.06, 1] }
        }
        transition={{
          duration: increased ? 0.6 : 2,
          repeat: increased ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame className="w-5 h-5 fill-orange-500 text-orange-500 drop-shadow-xs" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={streak}
          initial={increased ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-base font-extrabold tracking-tight text-orange-700"
        >
          {streak}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};
