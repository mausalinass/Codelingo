namespace Codelingo.Api.Models;

public sealed class UserStreak
{
public Guid UserId { get; set; }
public int CurrentStreak { get; set; }
public int LongestStreak { get; set; }
public DateOnly? LastActivityDate { get; set; }
public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
