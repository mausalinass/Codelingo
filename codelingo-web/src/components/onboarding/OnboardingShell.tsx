import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "../navigation/ThemeToggle";

export function OnboardingShell({ step, backTo, children }: { step: number; backTo: string; children: ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-white transition-colors">
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center px-5 sm:px-10">
      <Link to={backTo} aria-label="Go back" className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center"><ArrowLeft /></Link>
      <div className="mx-auto flex gap-2" aria-label={`Step ${step} of 5`}>
        {[1,2,3,4,5].map((n) => <span key={n} className={`h-2.5 w-10 sm:w-16 rounded-full ${n <= step ? "bg-red-600" : "bg-slate-200 dark:bg-slate-800"}`} />)}
      </div>
      <ThemeToggle />
    </header>
    <main className="max-w-4xl mx-auto px-5 py-10 sm:py-14">{children}</main>
  </div>;
}

export function LouisPrompt({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-center gap-4 mb-8">
    <img src="/louis-thinking-2_5d.png" className="louis-idle w-24 h-24 object-contain" alt="Louis, Codelingo's red cardinal" />
    <div className="relative max-w-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 font-bold shadow-sm">{children}</div>
  </div>;
}

export const primaryButton = "w-full rounded-2xl border-b-4 border-red-800 bg-red-600 px-6 py-4 font-black text-white shadow-sm transition hover:bg-red-700 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400";
