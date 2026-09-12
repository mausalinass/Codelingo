import React from "react";
import {
  Terminal,
  Layers,
  GitBranch,
  Code2,
  Repeat,
  ListOrdered,
  Boxes,
  Zap,
  ShieldAlert,
  Sparkles,
  Hash,
  FileCode,
  ShieldCheck,
  TerminalSquare,
  Cog,
  Send,
  Cpu,
  Coffee,
  BookOpen,
  MessageCircle,
  Smile,
  Utensils,
  Users,
  Compass,
  Clock,
  Calendar,
  Palette,
  HelpCircle,
  Trophy,
  PlusCircle,
  Grid,
  Divide,
  Percent,
  Coins,
  Calculator,
  Shapes,
  Maximize2,
  ListTree,
  Flame,
  Globe,
  Languages,
} from "lucide-react";
import type { LanguageId } from "../types/api";

/**
 * Icons dedicated to each Lesson Type (Coding, Languages & Math)
 */
const LESSON_ICONS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    syntaxTag: string;
    topic: string;
  }
> = {
  // Coding Lessons
  hello: {
    icon: Terminal,
    syntaxTag: ">_",
    topic: "Console I/O",
  },
  variables: {
    icon: Layers,
    syntaxTag: "var",
    topic: "Types & Memory",
  },
  conditions: {
    icon: GitBranch,
    syntaxTag: "if",
    topic: "Logic Gates",
  },
  functions: {
    icon: Code2,
    syntaxTag: "fn()",
    topic: "Scope & Return",
  },
  loops: {
    icon: Repeat,
    syntaxTag: "for",
    topic: "Iteration",
  },
  arrays: {
    icon: ListOrdered,
    syntaxTag: "[ ]",
    topic: "Collections",
  },
  oop: {
    icon: Boxes,
    syntaxTag: "class",
    topic: "OOP & Structs",
  },
  async: {
    icon: Zap,
    syntaxTag: "async",
    topic: "Concurrency",
  },
  errors: {
    icon: ShieldAlert,
    syntaxTag: "try",
    topic: "Exception Guard",
  },
  generics: {
    icon: Sparkles,
    syntaxTag: "<T>",
    topic: "Type Systems",
  },

  // Spoken Language Lessons
  lang_greetings: {
    icon: MessageCircle,
    syntaxTag: "¡Hola!",
    topic: "Greetings",
  },
  lang_phrases: {
    icon: Smile,
    syntaxTag: "Intro",
    topic: "Introductions",
  },
  lang_food: {
    icon: Utensils,
    syntaxTag: "Food",
    topic: "Dining & Cafe",
  },
  lang_family: {
    icon: Users,
    syntaxTag: "Family",
    topic: "People & Relatives",
  },
  lang_travel: {
    icon: Compass,
    syntaxTag: "Travel",
    topic: "Transit & Places",
  },
  lang_numbers: {
    icon: Clock,
    syntaxTag: "1 2 3",
    topic: "Numbers & Time",
  },
  lang_routine: {
    icon: Calendar,
    syntaxTag: "Daily",
    topic: "Habits & Routine",
  },
  lang_colors: {
    icon: Palette,
    syntaxTag: "Colors",
    topic: "Descriptions",
  },
  lang_questions: {
    icon: HelpCircle,
    syntaxTag: "¿?",
    topic: "Questions",
  },
  lang_mastery: {
    icon: Trophy,
    syntaxTag: "Story",
    topic: "Dialogue Mastery",
  },

  // Mathematics Lessons
  math_addition: {
    icon: PlusCircle,
    syntaxTag: "+ -",
    topic: "Add & Subtract",
  },
  math_multiplication: {
    icon: Grid,
    syntaxTag: "×",
    topic: "Grid Arrays",
  },
  math_division: {
    icon: Divide,
    syntaxTag: "÷",
    topic: "Equal Shares",
  },
  math_fractions: {
    icon: Percent,
    syntaxTag: "½",
    topic: "Parts of Whole",
  },
  math_decimals: {
    icon: Coins,
    syntaxTag: ".00",
    topic: "Decimals & Money",
  },
  math_algebra: {
    icon: Calculator,
    syntaxTag: "f(x)",
    topic: "Solving for X",
  },
  math_geometry: {
    icon: Shapes,
    syntaxTag: "📐",
    topic: "Angles & Shapes",
  },
  math_area: {
    icon: Maximize2,
    syntaxTag: "Area",
    topic: "Area & Perimeter",
  },
  math_order: {
    icon: ListTree,
    syntaxTag: "( )",
    topic: "PEMDAS Priority",
  },
  math_challenge: {
    icon: Flame,
    syntaxTag: "⚡",
    topic: "Speed Mental Math",
  },
};

interface LessonTopicIconProps {
  lessonId: string;
  className?: string;
}

export const LessonTopicIcon: React.FC<LessonTopicIconProps> = ({
  lessonId,
  className = "",
}) => {
  const IconComponent = LESSON_ICONS[lessonId]?.icon || BookOpen;
  return <IconComponent className={className} />;
};

/**
 * Dedicated visual icons for each Language / Subject Track
 */
const LANGUAGE_ICONS: Record<
  LanguageId,
  React.ComponentType<{ className?: string }>
> = {
  // Coding
  csharp: Hash,
  javascript: FileCode,
  typescript: ShieldCheck,
  python: TerminalSquare,
  rust: Cog,
  go: Send,
  cpp: Cpu,
  java: Coffee,
  kotlin: Boxes,
  swift: Flame,

  // Spoken Languages
  spanish: Languages,
  french: Globe,
  german: MessageCircle,
  japanese: Sparkles,
  italian: Utensils,
  portuguese: Globe,
  mandarin: Languages,
  korean: Sparkles,
  russian: BookOpen,
  arabic: Compass,

  // Mathematics
  math_basics: PlusCircle,
  math_fractions: Divide,
  math_algebra: Calculator,
  math_geometry: Shapes,
  math_mental: Zap,
};

interface LanguageTrackIconProps {
  languageId: LanguageId;
  className?: string;
}

const ProgrammingLanguageIcon = ({ languageId, className = "" }: LanguageTrackIconProps) => {
  const common = { className, viewBox: "0 0 48 48", role: "img", "aria-label": `${languageId} logo` };
  if (languageId === "python") return <svg {...common}><path fill="#3776ab" d="M24 4c-11 0-10 5-10 5v7h11v2H10s-6-1-6 10 5 11 5 11h6v-8s0-5 5-5h10s5 0 5-5V9s1-5-11-5Zm-6 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/><path fill="#ffd43b" d="M24 44c11 0 10-5 10-5v-7H23v-2h15s6 1 6-10-5-11-5-11h-6v8s0 5-5 5H18s-5 0-5 5v12s-1 5 11 5Zm6-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>;
  if (languageId === "javascript") return <svg {...common}><rect width="44" height="44" x="2" y="2" rx="7" fill="#f7df1e"/><text x="24" y="34" textAnchor="middle" fontSize="22" fontWeight="900" fill="#151515">JS</text></svg>;
  if (languageId === "typescript") return <svg {...common}><rect width="44" height="44" x="2" y="2" rx="7" fill="#3178c6"/><text x="24" y="34" textAnchor="middle" fontSize="21" fontWeight="900" fill="white">TS</text></svg>;
  if (languageId === "csharp") return <svg {...common}><path fill="#6f2da8" d="m24 2 19 11v22L24 46 5 35V13Z"/><text x="24" y="31" textAnchor="middle" fontSize="19" fontWeight="900" fill="white">C#</text></svg>;
  if (languageId === "go") return <svg {...common}><text x="24" y="31" textAnchor="middle" fontSize="22" fontWeight="900" fontStyle="italic" fill="#00add8">GO</text><path stroke="#00add8" strokeWidth="3" d="M2 17h11M5 23h8M1 29h12"/></svg>;
  if (languageId === "rust") return <svg {...common}><circle cx="24" cy="24" r="20" fill="#1f2937"/><circle cx="24" cy="24" r="14" fill="white"/><text x="24" y="31" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1f2937">R</text></svg>;
  if (languageId === "java") return <svg {...common}><path fill="none" stroke="#e76f00" strokeWidth="3" strokeLinecap="round" d="M27 4c-8 6 6 7-2 14M31 10c7 6-6 7-2 12"/><path fill="none" stroke="#5382a1" strokeWidth="4" strokeLinecap="round" d="M11 24h23v9c0 7-20 7-20 0M34 27h3c7 0 5 8-2 8M10 42c9 3 21 3 29-1"/></svg>;
  if (languageId === "cpp") return <svg {...common}><path fill="#00599c" d="m24 2 20 11v22L24 46 4 35V13Z"/><text x="24" y="30" textAnchor="middle" fontSize="15" fontWeight="900" fill="white">C++</text></svg>;
  return null;
};

export const LanguageTrackIcon: React.FC<LanguageTrackIconProps> = ({
  languageId,
  className = "",
}) => {
  if (["python", "javascript", "typescript", "csharp", "go", "rust", "java", "cpp"].includes(languageId)) {
    return <ProgrammingLanguageIcon languageId={languageId} className={className} />;
  }
  // Flags for spoken languages
  if (languageId === "spanish") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇪🇸</span>;
  }
  if (languageId === "french") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇫🇷</span>;
  }
  if (languageId === "german") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇩🇪</span>;
  }
  if (languageId === "japanese") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇯🇵</span>;
  }
  if (languageId === "italian") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇮🇹</span>;
  }
  if (languageId === "portuguese") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇧🇷</span>;
  }
  if (languageId === "mandarin") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇨🇳</span>;
  }
  if (languageId === "korean") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇰🇷</span>;
  }
  if (languageId === "russian") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇷🇺</span>;
  }
  if (languageId === "arabic") {
    return <span className={`inline-flex items-center justify-center select-none text-base ${className}`}>🇸🇦</span>;
  }

  const IconComponent = LANGUAGE_ICONS[languageId] || Code2;
  return <IconComponent className={className} />;
};

