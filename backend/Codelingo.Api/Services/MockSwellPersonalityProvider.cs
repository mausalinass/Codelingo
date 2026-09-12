using System.Text.Json;
namespace Codelingo.Api.Services;
public sealed class MockSwellPersonalityProvider : ISwellPersonalityProvider
{
    public Task<SwellProviderProfile> GetProfileAsync(Guid userId, CancellationToken ct) => Task.FromResult(ForTrait("ANALYTICAL"));
    public static SwellProviderProfile ForTrait(string trait)
    {
        var scores = trait switch
        {
            "ANALYTICAL" => (0.88m, 0.41m, 0.52m),
            "PRACTICAL" => (0.35m, 0.91m, 0.48m),
            "VISUAL" => (0.35m, 0.48m, 0.91m),
            _ => throw new ArgumentException("Invalid personality trait.")
        };
        return new("swell-demo-001", scores.Item1, scores.Item2, scores.Item3,
            JsonSerializer.Serialize(new { profileId = "swell-demo-001", traits = new { analytical = scores.Item1, practical = scores.Item2, visual = scores.Item3 } }));
    }
}
