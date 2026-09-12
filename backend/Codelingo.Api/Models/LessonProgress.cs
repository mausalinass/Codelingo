namespace Codelingo.Api.Models;

public sealed class LessonProgress
{
public Guid Id { get; set; } = Guid.NewGuid();
public Guid UserId { get; set; }
public string Language { get; set; } = "";
public string LessonId { get; set; } = "";
public bool IsCompleted { get; set; }
public DateTime? CompletedAt { get; set; }
public int XpAwarded { get; set; }
}
