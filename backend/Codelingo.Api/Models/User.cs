namespace Codelingo.Api.Models;

public sealed class User
{
public Guid Id { get; set; } = Guid.NewGuid();
public string DisplayName { get; set; } = "";
public string? Email { get; set; }
public string ActiveLanguage { get; set; } = "python";
public int TotalXp { get; set; }
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
