import type { LanguageId } from "../types/api";

export const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

export interface LanguageMeta {
  id: LanguageId;
  label: string;
  badge: string;
  color: string;
  accent: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageId, LanguageMeta> = {
  csharp: {
    id: "csharp",
    label: "C#",
    badge: "C#",
    color: "from-purple-600 to-indigo-600",
    accent: "#9333EA",
    description: "Enterprise backend & game development with C# .NET",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript / TypeScript",
    badge: "JS / TS",
    color: "from-amber-500 to-yellow-500",
    accent: "#F59E0B",
    description: "Modern web frontend & full-stack development",
  },
  python: {
    id: "python",
    label: "Python",
    badge: "Py",
    color: "from-blue-500 to-cyan-500",
    accent: "#3B82F6",
    description: "Data science, AI scripting & readable backend logic",
  },
};
