import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Sparkles, Check, Brain, Zap, Eye } from "lucide-react";
import confetti from "canvas-confetti";
import { useQueryClient } from "@tanstack/react-query";
import { DEMO_USER_ID } from "../../lib/constants";
import { mockState } from "../../api/mockData";
import { LouisCoach } from "../louis/LouisCoach";
import type { PersonalityTrait } from "../../types/api";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTrait, setSelectedTrait] = useState<PersonalityTrait>("ANALYTICAL");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Update local state and mock data
    mockState.personality = selectedTrait;

    // Invalidate queries so dashboard and personality instantly reflect changes
    queryClient.setQueryData(["dashboard", DEMO_USER_ID], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        user: {
          ...old.user,
          displayName: name.trim(),
        },
      };
    });

    queryClient.invalidateQueries({ queryKey: ["dashboard", DEMO_USER_ID] });
    queryClient.invalidateQueries({ queryKey: ["personality", DEMO_USER_ID] });

    // Celebration
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#E52E2E", "#58CC02", "#FF9600", "#3B82F6"],
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const traitOptions = [
    {
      id: "ANALYTICAL" as PersonalityTrait,
      label: "Analytical",
      desc: "Deep explanation & system logic",
      icon: Brain,
      color: "border-blue-400 bg-blue-50 text-blue-800",
    },
    {
      id: "PRACTICAL" as PersonalityTrait,
      label: "Practical",
      desc: "Code-first & hands-on exercises",
      icon: Zap,
      color: "border-emerald-400 bg-emerald-50 text-emerald-800",
    },
    {
      id: "VISUAL" as PersonalityTrait,
      label: "Visual",
      desc: "Flowcharts & visual gates",
      icon: Eye,
      color: "border-purple-400 bg-purple-50 text-purple-800",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    Create Your Account
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Personalized learning powered by Swell
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSuccess ? (
                <div className="py-8 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    Welcome aboard, {name}! 🎉
                  </h4>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Your profile has been created with your tailored {selectedTrait.toLowerCase()} learning track.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Louis Coach intro */}
                  <div className="mb-1">
                    <LouisCoach
                      mood="encouraging"
                      size="sm"
                      message="Ready to unlock your streak and track your coding progress?"
                    />
                  </div>

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="account-name"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="account-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-semibold text-slate-900 text-sm outline-hidden transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="account-email"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="account-email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-semibold text-slate-900 text-sm outline-hidden transition-all"
                    />
                  </div>

                  {/* Personality Preference */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Choose Your Learning Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {traitOptions.map((t) => {
                        const isSelected = selectedTrait === t.id;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTrait(t.id)}
                            className={`p-3 rounded-xl border text-left flex flex-col items-start gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? `${t.color} border-2 shadow-xs ring-1 ring-current/20 scale-102`
                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="font-bold text-xs">{t.label}</span>
                            <span className="text-[10px] text-slate-500 leading-tight">
                              {t.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 ${
                        !name.trim()
                          ? "bg-slate-300 cursor-not-allowed shadow-none"
                          : "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
