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

export const LanguageTrackIcon: React.FC<LanguageTrackIconProps> = ({
  languageId,
  className = "",
}) => {
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

