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
} from "lucide-react";
import type { LanguageId } from "../types/api";

/**
 * Icons dedicated to each Lesson Type
 */
const LESSON_ICONS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    syntaxTag: string;
    topic: string;
  }
> = {
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
 * Dedicated visual icons for each Programming Language
 */
const LANGUAGE_ICONS: Record<
  LanguageId,
  React.ComponentType<{ className?: string }>
> = {
  csharp: Hash,
  javascript: FileCode,
  typescript: ShieldCheck,
  python: TerminalSquare,
  rust: Cog,
  go: Send,
  cpp: Cpu,
  java: Coffee,
};

interface LanguageTrackIconProps {
  languageId: LanguageId;
  className?: string;
}

export const LanguageTrackIcon: React.FC<LanguageTrackIconProps> = ({
  languageId,
  className = "",
}) => {
  const IconComponent = LANGUAGE_ICONS[languageId] || Code2;
  return <IconComponent className={className} />;
};
