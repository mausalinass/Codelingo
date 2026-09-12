import type { ProgrammingTrack } from "../context/OnboardingContext";

export interface PlacementQuestion {
  id: string;
  prompt: string;
  code: string;
  options: string[];
  answer: string;
}

const syntax: Record<ProgrammingTrack, string[]> = {
  csharp: ["int score = 12;", "Console.WriteLine(3 + 2);", "if (age >= 18)", "for (int i = 0; i < 3; i++)", "int Add(int a, int b) => a + b;"],
  javascript: ["let score = 12;", "console.log(3 + 2);", "if (age >= 18)", "for (let i = 0; i < 3; i++)", "const add = (a, b) => a + b;"],
  typescript: ["let score: number = 12;", "console.log(3 + 2);", "if (age >= 18)", "for (let i = 0; i < 3; i++)", "const add = (a: number, b: number) => a + b;"],
  python: ["score = 12", "print(3 + 2)", "if age >= 18:", "for i in range(3):", "def add(a, b): return a + b"],
};

export function placementQuestions(track: ProgrammingTrack): PlacementQuestion[] {
  const code = syntax[track];
  return [
    { id: `${track}-q1`, prompt: "What value is stored in score?", code: code[0], options: ["10", "12", "score", "I don't know"], answer: "12" },
    { id: `${track}-q2`, prompt: "What does this calculation output?", code: code[1], options: ["3", "5", "32", "I don't know"], answer: "5" },
    { id: `${track}-q3`, prompt: "When is this condition true?", code: code[2], options: ["Age is at least 18", "Age is under 18", "Always", "I don't know"], answer: "Age is at least 18" },
    { id: `${track}-q4`, prompt: "How many times does this loop run?", code: code[3], options: ["2", "3", "4", "I don't know"], answer: "3" },
    { id: `${track}-q5`, prompt: "What does this function return for 2 and 4?", code: code[4], options: ["2", "4", "6", "I don't know"], answer: "6" },
  ];
}

export function recommendation(score: number) {
  if (score <= 1) return "hello";
  if (score <= 3) return "variables";
  if (score === 4) return "conditions";
  return "functions";
}
