import type { LanguageId } from "../types/api";

export const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

export interface LanguageMeta {
  id: LanguageId;
  label: string;
  badge: string;
  color: string;
  accent: string;
  description: string;
  category: "Popular" | "Web & Frontend" | "Systems & Cloud" | "Enterprise";
}

export const SUPPORTED_LANGUAGES: Record<LanguageId, LanguageMeta> = {
  csharp: {
    id: "csharp",
    label: "C#",
    badge: "C#",
    color: "from-purple-600 to-indigo-600",
    accent: "#9333EA",
    description: "Enterprise backend & game development with C# .NET",
    category: "Enterprise",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    badge: "JS",
    color: "from-amber-500 to-yellow-500",
    accent: "#F59E0B",
    description: "Web frontend, dynamic scripting & full-stack Node.js",
    category: "Web & Frontend",
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    badge: "TS",
    color: "from-blue-600 to-sky-600",
    accent: "#2563EB",
    description: "Type-safe modern web, large-scale applications & APIs",
    category: "Web & Frontend",
  },
  python: {
    id: "python",
    label: "Python",
    badge: "Py",
    color: "from-blue-500 to-cyan-500",
    accent: "#3B82F6",
    description: "Data science, AI scripting & readable backend logic",
    category: "Popular",
  },
  rust: {
    id: "rust",
    label: "Rust",
    badge: "Rs",
    color: "from-orange-600 to-red-600",
    accent: "#EA580C",
    description: "Ultra-fast systems programming, memory safety & WebAssembly",
    category: "Systems & Cloud",
  },
  go: {
    id: "go",
    label: "Go (Golang)",
    badge: "Go",
    color: "from-cyan-500 to-teal-500",
    accent: "#06B6D4",
    description: "High-performance microservices, cloud infrastructure & concurrency",
    category: "Systems & Cloud",
  },
  cpp: {
    id: "cpp",
    label: "C++",
    badge: "C++",
    color: "from-blue-700 to-indigo-800",
    accent: "#1D4ED8",
    description: "Game engines, graphics programming, low latency & performance",
    category: "Systems & Cloud",
  },
  java: {
    id: "java",
    label: "Java",
    badge: "☕",
    color: "from-red-600 to-amber-700",
    accent: "#DC2626",
    description: "Enterprise backend architecture, Spring Boot & Android apps",
    category: "Enterprise",
  },
};

