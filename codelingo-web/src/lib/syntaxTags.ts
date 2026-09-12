export const LESSON_SYNTAX_TAGS: Record<string, string> = {
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
};

export const getLessonSyntaxTag = (lessonId: string): string => {
  return LESSON_SYNTAX_TAGS[lessonId] || "{ }";
};
