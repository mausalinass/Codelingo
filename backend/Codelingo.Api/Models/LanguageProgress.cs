namespace Codelingo.Api.Models;

public sealed class LanguageProgress
{
public Guid Id { get; set; } = Guid.NewGuid();
public Guid UserId { get; set; }
public string Language { get; set; } = "";
public int CompletedLessons { get; set; }
public int TotalLessons { get; set; } = 3;
public int Xp { get; set; }
public int CurrentLesson { get; set; } = 1;
public decimal CompletionPercentage { get; set; }
public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
