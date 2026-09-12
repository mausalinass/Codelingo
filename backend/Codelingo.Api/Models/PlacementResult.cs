namespace Codelingo.Api.Models;

public sealed class PlacementResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Language { get; set; } = "csharp";
    public int CorrectAnswers { get; set; }
    public int TotalQuestions { get; set; } = 5;
    public string RecommendedLessonId { get; set; } = "hello";
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}
