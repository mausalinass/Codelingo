namespace Codelingo.Api.Models;

public sealed class ExerciseAttempt
{
public Guid Id { get; set; } = Guid.NewGuid();
public Guid UserId { get; set; }
public string Language { get; set; } = "";
public string LessonId { get; set; } = "";
public string ExerciseId { get; set; } = "";
public string SubmittedAnswer { get; set; } = "";
public bool IsCorrect { get; set; }
public int XpAwarded { get; set; }
public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
}
