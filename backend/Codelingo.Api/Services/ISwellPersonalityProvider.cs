namespace Codelingo.Api.Services;
public interface ISwellPersonalityProvider
{
    Task<SwellProviderProfile> GetProfileAsync(Guid userId, CancellationToken ct);
}
public sealed record SwellProviderProfile(string ExternalId, decimal Analytical, decimal Practical, decimal Visual, string RawJson);
