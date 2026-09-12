namespace Codelingo.Api.Dtos;
public sealed record AdaptiveLessonDto(string LessonId, string Language, string Personality, string PresentationMode, string Title, string LouisMessage, string? Explanation, string[] VisualSteps, bool ShowExplanationFirst, ExerciseDto Exercise);
public sealed record ExerciseDto(string Id, string Type, string Prompt, string StarterCode, ProblemDto[] Problems);
public sealed record ProblemDto(string Id, string Prompt, string Goal, string StarterCode, string[] VisualSteps);
