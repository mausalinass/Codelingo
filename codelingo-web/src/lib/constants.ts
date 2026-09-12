import type {
  LanguageId,
  SubjectCategory,
  CodingLanguageId,
  SpokenLanguageId,
  MathTrackId,
} from "../types/api";

export const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

export const CODING_LANGUAGES: CodingLanguageId[] = [
  "csharp",
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "cpp",
  "java",
  "kotlin",
  "swift",
];

export const SPOKEN_LANGUAGES: SpokenLanguageId[] = [
  "spanish",
  "french",
  "german",
  "japanese",
  "italian",
  "portuguese",
  "mandarin",
  "korean",
  "russian",
  "arabic",
];

export const MATH_TRACKS: MathTrackId[] = [
  "math_basics",
  "math_fractions",
  "math_algebra",
  "math_geometry",
  "math_mental",
];

export interface LanguageMeta {
  id: LanguageId;
  label: string;
  badge: string;
  flag?: string;
  color: string;
  accent: string;
  description: string;
  subject: SubjectCategory;
  category: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageId, LanguageMeta> = {
  // Programming Languages
  csharp: {
    id: "csharp",
    label: "C#",
    badge: "C#",
    color: "from-purple-600 to-indigo-600",
    accent: "#9333EA",
    description: "Enterprise backend & game development with C# .NET",
    subject: "coding",
    category: "Enterprise",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    badge: "JS",
    color: "from-amber-500 to-yellow-500",
    accent: "#F59E0B",
    description: "Web frontend, dynamic scripting & full-stack Node.js",
    subject: "coding",
    category: "Web & Frontend",
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    badge: "TS",
    color: "from-blue-600 to-sky-600",
    accent: "#2563EB",
    description: "Type-safe modern web, large-scale applications & APIs",
    subject: "coding",
    category: "Web & Frontend",
  },
  python: {
    id: "python",
    label: "Python",
    badge: "Py",
    color: "from-blue-500 to-cyan-500",
    accent: "#3B82F6",
    description: "Data science, AI scripting & readable backend logic",
    subject: "coding",
    category: "Popular",
  },
  rust: {
    id: "rust",
    label: "Rust",
    badge: "Rs",
    color: "from-orange-600 to-red-600",
    accent: "#EA580C",
    description: "Ultra-fast systems programming, memory safety & WebAssembly",
    subject: "coding",
    category: "Systems & Cloud",
  },
  go: {
    id: "go",
    label: "Go (Golang)",
    badge: "Go",
    color: "from-cyan-500 to-teal-500",
    accent: "#06B6D4",
    description: "High-performance microservices, cloud infrastructure & concurrency",
    subject: "coding",
    category: "Systems & Cloud",
  },
  cpp: {
    id: "cpp",
    label: "C++",
    badge: "C++",
    color: "from-blue-700 to-indigo-800",
    accent: "#1D4ED8",
    description: "Game engines, graphics programming, low latency & performance",
    subject: "coding",
    category: "Systems & Cloud",
  },
  java: {
    id: "java",
    label: "Java",
    badge: "☕",
    color: "from-red-600 to-amber-700",
    accent: "#DC2626",
    description: "Enterprise backend architecture, Spring Boot & Android apps",
    subject: "coding",
    category: "Enterprise",
  },
  kotlin: {
    id: "kotlin",
    label: "Kotlin",
    badge: "Kt",
    color: "from-purple-500 to-amber-500",
    accent: "#7F52FF",
    description: "Modern concise Android, multiplatform & JVM server development",
    subject: "coding",
    category: "Mobile & JVM",
  },
  swift: {
    id: "swift",
    label: "Swift",
    badge: "Sw",
    color: "from-orange-500 to-red-500",
    accent: "#F05138",
    description: "Fast, safe development for iOS, macOS, iPadOS & Apple Silicon",
    subject: "coding",
    category: "Apple & Mobile",
  },

  // Spoken / Natural Languages (Duolingo Style)
  spanish: {
    id: "spanish",
    label: "Spanish",
    badge: "ES",
    flag: "🇪🇸",
    color: "from-amber-500 to-red-500",
    accent: "#EF4444",
    description: "Greetings, vocabulary, word bank exercises & conversational Spanish",
    subject: "language",
    category: "Romance Languages",
  },
  french: {
    id: "french",
    label: "French",
    badge: "FR",
    flag: "🇫🇷",
    color: "from-blue-600 to-rose-500",
    accent: "#3B82F6",
    description: "Pronunciation, everyday phrases, dining & travel French",
    subject: "language",
    category: "Romance Languages",
  },
  german: {
    id: "german",
    label: "German",
    badge: "DE",
    flag: "🇩🇪",
    color: "from-yellow-500 to-stone-700",
    accent: "#F59E0B",
    description: "Sentence structures, articles, vocabulary & practical dialogue",
    subject: "language",
    category: "Germanic Languages",
  },
  japanese: {
    id: "japanese",
    label: "Japanese",
    badge: "JP",
    flag: "🇯🇵",
    color: "from-rose-500 to-red-600",
    accent: "#E11D48",
    description: "Hiragana, common polite phrases & practical conversational Japanese",
    subject: "language",
    category: "East Asian Languages",
  },
  italian: {
    id: "italian",
    label: "Italian",
    badge: "IT",
    flag: "🇮🇹",
    color: "from-emerald-500 to-red-500",
    accent: "#10B981",
    description: "Food, travel, expressive phrases & core Italian vocabulary",
    subject: "language",
    category: "Romance Languages",
  },
  portuguese: {
    id: "portuguese",
    label: "Portuguese",
    badge: "PT",
    flag: "🇧🇷",
    color: "from-emerald-500 to-yellow-500",
    accent: "#10B981",
    description: "Greetings, Brazilian & European vocabulary, word bank exercises & dialogues",
    subject: "language",
    category: "Romance Languages",
  },
  mandarin: {
    id: "mandarin",
    label: "Mandarin Chinese",
    badge: "ZH",
    flag: "🇨🇳",
    color: "from-red-600 to-yellow-500",
    accent: "#DC2626",
    description: "Pinyin, common characters, polite greetings & dining phrases",
    subject: "language",
    category: "East Asian Languages",
  },
  korean: {
    id: "korean",
    label: "Korean",
    badge: "KR",
    flag: "🇰🇷",
    color: "from-blue-600 to-red-600",
    accent: "#2563EB",
    description: "Hangul basics, polite honorifics, K-culture phrases & everyday conversation",
    subject: "language",
    category: "East Asian Languages",
  },
  russian: {
    id: "russian",
    label: "Russian",
    badge: "RU",
    flag: "🇷🇺",
    color: "from-blue-500 to-red-600",
    accent: "#3B82F6",
    description: "Cyrillic alphabet, essential cases, greetings & daily communication",
    subject: "language",
    category: "Slavic Languages",
  },
  arabic: {
    id: "arabic",
    label: "Arabic",
    badge: "AR",
    flag: "🇸🇦",
    color: "from-emerald-600 to-green-700",
    accent: "#059669",
    description: "Arabic script, root system, warm hospitality phrases & formal greetings",
    subject: "language",
    category: "Semitic Languages",
  },

  // Mathematics (Duolingo Math Style)
  math_basics: {
    id: "math_basics",
    label: "Elementary Math",
    badge: "➕",
    color: "from-emerald-500 to-teal-600",
    accent: "#10B981",
    description: "Multiplication arrays, division groups, mental addition & subtraction",
    subject: "math",
    category: "Foundations",
  },
  math_fractions: {
    id: "math_fractions",
    label: "Fractions & Decimals",
    badge: "➗",
    color: "from-cyan-500 to-blue-600",
    accent: "#06B6D4",
    description: "Visual fraction pie models, decimals, percentages & ratios",
    subject: "math",
    category: "Number Sense",
  },
  math_algebra: {
    id: "math_algebra",
    label: "Pre-Algebra",
    badge: "🧮",
    color: "from-violet-600 to-purple-700",
    accent: "#7C3AED",
    description: "Variables, linear equations, solving for X & mathematical balances",
    subject: "math",
    category: "Advanced",
  },
  math_geometry: {
    id: "math_geometry",
    label: "Geometry & Shapes",
    badge: "📐",
    color: "from-orange-500 to-amber-600",
    accent: "#F97316",
    description: "Angles, triangles, perimeter, rectangular area & visual geometry",
    subject: "math",
    category: "Geometry",
  },
  math_mental: {
    id: "math_mental",
    label: "Mental Math & Logic",
    badge: "⚡",
    color: "from-amber-400 to-orange-500",
    accent: "#F59E0B",
    description: "Rapid arithmetic shortcuts, estimation, number puzzles & speed calculation",
    subject: "math",
    category: "Foundations",
  },
};

export const CODING_LESSON_TEMPLATES = [
  {
    id: "hello",
    title: "1. Hello World",
    description: "Syntax basics & console printing",
    order: 1,
  },
  {
    id: "variables",
    title: "2. Variables & Types",
    description: "Constants, primitives & typing",
    order: 2,
  },
  {
    id: "conditions",
    title: "3. Conditions",
    description: "If-statements & boolean gates",
    order: 3,
  },
  {
    id: "functions",
    title: "4. Functions",
    description: "Parameters, return values & scope",
    order: 4,
  },
  {
    id: "loops",
    title: "5. Loops & Iteration",
    description: "While, for-in & repetition",
    order: 5,
  },
  {
    id: "arrays",
    title: "6. Arrays & Slices",
    description: "Lists, collections & indexing",
    order: 6,
  },
  {
    id: "oop",
    title: "7. Structs & Classes",
    description: "Object modeling & methods",
    order: 7,
  },
  {
    id: "async",
    title: "8. Async & Concurrency",
    description: "Tasks, promises & threads",
    order: 8,
  },
  {
    id: "errors",
    title: "9. Error Handling",
    description: "Try/catch, Result types & recovery",
    order: 9,
  },
  {
    id: "generics",
    title: "10. Generics & Traits",
    description: "Type parameters, interfaces & reuse",
    order: 10,
  },
];

export const LANGUAGE_LESSON_TEMPLATES = [
  {
    id: "lang_greetings",
    title: "1. Greetings & Basics",
    description: "Hello, good morning & polite basics",
    order: 1,
  },
  {
    id: "lang_phrases",
    title: "2. Introductions",
    description: "Names, origin & common expressions",
    order: 2,
  },
  {
    id: "lang_food",
    title: "3. Food & Dining",
    description: "Ordering meals, drinks & cafe phrases",
    order: 3,
  },
  {
    id: "lang_family",
    title: "4. Family & People",
    description: "Relationships, friends & descriptions",
    order: 4,
  },
  {
    id: "lang_travel",
    title: "5. Travel & Directions",
    description: "Places, transit & asking for directions",
    order: 5,
  },
  {
    id: "lang_numbers",
    title: "6. Numbers & Time",
    description: "Counting, prices, clock & dates",
    order: 6,
  },
  {
    id: "lang_routine",
    title: "7. Daily Routine",
    description: "Present tense action verbs & activities",
    order: 7,
  },
  {
    id: "lang_colors",
    title: "8. Colors & Objects",
    description: "Adjectives, agreement & daily items",
    order: 8,
  },
  {
    id: "lang_questions",
    title: "9. Questions & Clarification",
    description: "Who, what, where, when & why",
    order: 9,
  },
  {
    id: "lang_mastery",
    title: "10. Story & Conversation",
    description: "Interactive real-world dialogue mastery",
    order: 10,
  },
];

export const MATH_LESSON_TEMPLATES = [
  {
    id: "math_addition",
    title: "1. Addition & Subtraction",
    description: "Mental math, regrouping & number lines",
    order: 1,
  },
  {
    id: "math_multiplication",
    title: "2. Multiplication Arrays",
    description: "Grid visualizers, arrays & fast tables",
    order: 2,
  },
  {
    id: "math_division",
    title: "3. Division & Grouping",
    description: "Equal shares, remainders & inverse math",
    order: 3,
  },
  {
    id: "math_fractions",
    title: "4. Fractions as Parts",
    description: "Visual pie slices, numerators & halves",
    order: 4,
  },
  {
    id: "math_decimals",
    title: "5. Decimals & Money",
    description: "Tenths, hundredths & currency math",
    order: 5,
  },
  {
    id: "math_algebra",
    title: "6. Solving for X",
    description: "Balancing equations & linear unknowns",
    order: 6,
  },
  {
    id: "math_geometry",
    title: "7. Angles & Triangles",
    description: "Right angles, 180° rule & shape types",
    order: 7,
  },
  {
    id: "math_area",
    title: "8. Area & Perimeter",
    description: "Grid units, boundaries & rectangular area",
    order: 8,
  },
  {
    id: "math_order",
    title: "9. Order of Operations",
    description: "PEMDAS rules, brackets & precedence",
    order: 9,
  },
  {
    id: "math_challenge",
    title: "10. Math Master Challenge",
    description: "Multi-step logic puzzle & speed calculation",
    order: 10,
  },
];

export const LESSON_TEMPLATES = CODING_LESSON_TEMPLATES;

export function getCurriculumForTrack(langId: LanguageId) {
  const meta = SUPPORTED_LANGUAGES[langId];
  if (meta?.subject === "language") {
    return LANGUAGE_LESSON_TEMPLATES;
  }
  if (meta?.subject === "math") {
    return MATH_LESSON_TEMPLATES;
  }
  return CODING_LESSON_TEMPLATES;
}

