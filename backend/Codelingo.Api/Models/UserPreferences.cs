namespace Codelingo.Api.Models;

public sealed class UserPreferences
{
    public Guid UserId { get; set; }
    public string UiLanguage { get; set; } = "en";
    public string ProgrammingLanguage { get; set; } = "csharp";
    public string ExperienceLevel { get; set; } = "beginner";
    public bool OnboardingCompleted { get; set; }
    public string? StartingLessonId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
