namespace Codelingo.Api.Dtos;

public sealed record OnboardingPreferencesRequest(Guid UserId, string UiLanguage, string ProgrammingLanguage, string ExperienceLevel);
public sealed record PlacementAnswerDto(string QuestionId, string Answer);
public sealed record PlacementRequest(Guid UserId, string Language, PlacementAnswerDto[] Answers);
public sealed record OnboardingCompleteRequest(Guid UserId, string StartingLessonId);
public sealed record OnboardingDto(string UiLanguage, string ProgrammingLanguage, string ExperienceLevel, bool OnboardingCompleted, string? StartingLessonId, int? CorrectAnswers, int? TotalQuestions, string? RecommendedLessonId);
public sealed record PlacementDto(int CorrectAnswers, int TotalQuestions, string RecommendedLessonId, string RecommendedLessonTitle);
