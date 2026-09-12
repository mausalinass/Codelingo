import type { UiLanguage } from "../context/OnboardingContext";
import type { LanguageId } from "../types/api";
import { SUPPORTED_LANGUAGES } from "./constants";

const syntaxHints: Partial<Record<LanguageId, string>> = {
  python: 'print("texto")',
  javascript: 'console.log("text")',
  typescript: 'console.log("text")',
  csharp: 'Console.WriteLine("text");',
  java: 'System.out.println("text");',
  cpp: 'std::cout << "text";',
  go: 'fmt.Println("text")',
  rust: 'println!("text");',
};

export interface TaskGuidance {
  louisMessage: string;
  label: string;
  goal: string;
  hint?: string;
}

export function getTaskGuidance(language: LanguageId, lessonId: string, locale: UiLanguage | null, originalPrompt: string): TaskGuidance {
  const ui = locale === "es" || locale === "fr" ? locale : "en";
  const languageName = SUPPORTED_LANGUAGES[language].label;

  if (lessonId === "hello") {
    const target = "Hello, Louis!";
    return {
      louisMessage: ui === "es"
        ? `Escribe un programa en ${languageName} que muestre exactamente “${target}”.`
        : ui === "fr"
          ? `Écris un programme en ${languageName} qui affiche exactement « ${target} ».`
          : `Write a ${languageName} program that displays exactly “${target}”.`,
      label: ui === "es" ? "Texto que debe aparecer" : ui === "fr" ? "Texte à afficher" : "Required output",
      goal: target,
      hint: syntaxHints[language],
    };
  }

  return {
    louisMessage: ui === "es" ? `Tu reto exacto: ${originalPrompt}` : ui === "fr" ? `Ton défi exact : ${originalPrompt}` : `Your exact task: ${originalPrompt}`,
    label: ui === "es" ? "Objetivo exacto" : ui === "fr" ? "Objectif exact" : "Exact task",
    goal: originalPrompt,
  };
}
