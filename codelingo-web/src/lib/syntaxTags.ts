export const LESSON_SYNTAX_TAGS: Record<string, string> = {
  // Coding
  hello: ">_",
  variables: "var",
  conditions: "if",
  functions: "fn()",
  loops: "for",
  arrays: "[ ]",
  oop: "class",
  async: "async",
  errors: "try",
  generics: "<T>",

  // Spoken Languages
  lang_greetings: "¡Hola!",
  lang_phrases: "Intro",
  lang_food: "Café",
  lang_family: "Amigo",
  lang_travel: "Viaje",
  lang_numbers: "1 2 3",
  lang_routine: "Día",
  lang_colors: "Rojo",
  lang_questions: "¿Qué?",
  lang_mastery: "Story",

  // Mathematics
  math_addition: "+ -",
  math_multiplication: "×",
  math_division: "÷",
  math_fractions: "½",
  math_decimals: ".00",
  math_algebra: "f(x)",
  math_geometry: "📐",
  math_area: "Area",
  math_order: "( )",
  math_challenge: "⚡",
};

export const getLessonSyntaxTag = (lessonId: string): string => {
  return LESSON_SYNTAX_TAGS[lessonId] || "●";
};

