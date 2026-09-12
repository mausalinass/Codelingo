namespace Codelingo.Api.Dtos;
public sealed record EvaluateResponse(bool Correct, int XpAwarded, FeedbackDto Feedback, EvaluationProgress Progress, EvaluationStreak Streak);
public sealed record FeedbackDto(string Title, string Message);
public sealed record EvaluationProgress(bool LessonCompleted, decimal LanguagePercentage);
public sealed record EvaluationStreak(int Previous, int Current, bool Increased);
