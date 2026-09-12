using Codelingo.Api.Models;
using Codelingo.Api.Curriculum;
using Codelingo.Api.Services;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Data;
public sealed class DemoSeed(CodelingoDbContext db, CurriculumCatalog catalog)
{
    public static readonly Guid UserId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public async Task EnsureAsync(CancellationToken ct = default)
    {
        if (!await db.Users.AnyAsync(x => x.Id == UserId, ct)) await ResetAsync(ct);
    }
    public async Task ResetAsync(CancellationToken ct = default)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        // Stable advisory lock also serializes the initial seed when no user row exists yet.
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(11111111)", ct);
        var user = await db.Users.FromSqlInterpolated($"SELECT * FROM users WHERE id = {UserId} FOR UPDATE").SingleOrDefaultAsync(ct);
        if (user is null) { user = new() { Id = UserId }; db.Users.Add(user); }
        else
        {
            await db.PlacementResults.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.UserPreferences.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.ExerciseAttempts.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.LessonProgress.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.LanguageProgress.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.UserStreaks.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.SwellProfiles.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
        }
        var now = DateTime.UtcNow;
        user.DisplayName = "Mauricio"; user.Email = "demo@codelingo.dev"; user.ActiveLanguage = "csharp"; user.TotalXp = 120; user.UpdatedAt = now;
        db.UserStreaks.Add(new() { UserId = UserId, CurrentStreak = 0, LongestStreak = 0, LastActivityDate = null });
        var profile = new SwellProfile { UserId = UserId }; PersonalityService.Apply(profile, MockSwellPersonalityProvider.ForTrait("ANALYTICAL")); db.SwellProfiles.Add(profile);
        foreach (var language in CurriculumCatalog.Languages)
        {
            var completed = language is "python" or "csharp";
            var route = catalog.ForLanguage(language);
            db.LanguageProgress.Add(new() { UserId = UserId, Language = language, TotalLessons = route.Length, CompletedLessons = completed ? 1 : 0, Xp = completed ? 10 : 0, CurrentLesson = completed ? 2 : 1, CompletionPercentage = completed ? ProgressService.Percentage(1, route.Length) : 0 });
            foreach (var lesson in route.Select(x => x.Id))
                db.LessonProgress.Add(new() { UserId = UserId, Language = language, LessonId = lesson, IsCompleted = completed && lesson == "hello", XpAwarded = completed && lesson == "hello" ? 10 : 0, CompletedAt = completed && lesson == "hello" ? now : null });
        }
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
    }
}
