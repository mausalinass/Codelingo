namespace Codelingo.Api.Models;

public sealed class SwellProfile
{
public Guid Id { get; set; } = Guid.NewGuid();
public Guid UserId { get; set; }
public string SwellExternalId { get; set; } = "";
public string PrimaryTrait { get; set; } = "ANALYTICAL";
public decimal AnalyticalScore { get; set; }
public decimal PracticalScore { get; set; }
public decimal VisualScore { get; set; }
public string RawPayload { get; set; } = "{}";
public DateTime FetchedAt { get; set; } = DateTime.UtcNow;
}
