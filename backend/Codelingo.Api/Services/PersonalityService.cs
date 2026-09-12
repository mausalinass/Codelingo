using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Services;
public sealed class PersonalityService(CodelingoDbContext db, ISwellPersonalityProvider provider)
{
    public static string Normalize(decimal analytical, decimal practical, decimal visual) =>
        analytical >= practical && analytical >= visual ? "ANALYTICAL" : practical >= visual ? "PRACTICAL" : "VISUAL";
    public static string LearningMode(string trait) => trait switch { "PRACTICAL" => "PRACTICE_FIRST", "VISUAL" => "VISUAL_GUIDED", _ => "DEEP_EXPLANATION" };
    public static PersonalityDto ToDto(SwellProfile p) => new("SWELL_MOCK", p.PrimaryTrait, LearningMode(p.PrimaryTrait), new(p.AnalyticalScore, p.PracticalScore, p.VisualScore));
    public static void Apply(SwellProfile p, SwellProviderProfile source)
    {
        p.SwellExternalId = source.ExternalId;
        p.AnalyticalScore = source.Analytical; p.PracticalScore = source.Practical; p.VisualScore = source.Visual;
        p.PrimaryTrait = Normalize(source.Analytical, source.Practical, source.Visual);
        p.RawPayload = source.RawJson; p.FetchedAt = DateTime.UtcNow;
    }
    public async Task<PersonalityDto?> GetAsync(Guid userId, CancellationToken ct)
    {
        // Serialize refreshes and demo switches with evaluation/reset on the same user.
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var user = await db.Users.FromSqlInterpolated($"SELECT * FROM users WHERE id = {userId} FOR UPDATE").SingleOrDefaultAsync(ct);
        if (user is null) return null;
        var p = await db.SwellProfiles.SingleOrDefaultAsync(x => x.UserId == userId, ct);
        if (p is null)
        {
            p = new() { UserId = userId }; Apply(p, await provider.GetProfileAsync(userId, ct));
            db.SwellProfiles.Add(p); await db.SaveChangesAsync(ct);
        }
        await tx.CommitAsync(ct);
        return ToDto(p);
    }
    public async Task<PersonalityDto?> SwitchAsync(Guid userId, string trait, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        if (await db.Users.FromSqlInterpolated($"SELECT * FROM users WHERE id = {userId} FOR UPDATE").SingleOrDefaultAsync(ct) is null) return null;
        var p = await db.SwellProfiles.SingleOrDefaultAsync(x => x.UserId == userId, ct);
        if (p is null) { p = new() { UserId = userId }; db.SwellProfiles.Add(p); }
        Apply(p, MockSwellPersonalityProvider.ForTrait(trait));
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); return ToDto(p);
    }
}
