using Codelingo.Api.Models;
using Codelingo.Api.Services;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Data;
public sealed class DemoSeed(CodelingoDbContext db, StreakService dates)
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
            await db.ExerciseAttempts.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.LessonProgress.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.LanguageProgress.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.UserStreaks.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
            await db.SwellProfiles.Where(x => x.UserId == UserId).ExecuteDeleteAsync(ct);
        }
        var now = DateTime.UtcNow;
        user.DisplayName = "Mauricio"; user.Email = "demo@codelingo.dev"; user.ActiveLanguage = "csharp"; user.TotalXp = 120; user.UpdatedAt = now;
        db.UserStreaks.Add(new() { UserId = UserId, CurrentStreak = 4, LongestStreak = 7, LastActivityDate = dates.Today.AddDays(-1) });
        var profile = new SwellProfile { UserId = UserId }; PersonalityService.Apply(profile, MockSwellPersonalityProvider.ForTrait("ANALYTICAL")); db.SwellProfiles.Add(profile);
        foreach (var language in new[] { "python", "javascript", "csharp" })
        {
            var completed = language != "javascript";
            db.LanguageProgress.Add(new() { UserId = UserId, Language = language, CompletedLessons = completed ? 1 : 0, Xp = completed ? 10 : 0, CurrentLesson = completed ? 2 : 1, CompletionPercentage = completed ? 33.33m : 0 });
            foreach (var lesson in new[] { "hello", "conditions", "loops" })
                db.LessonProgress.Add(new() { UserId = UserId, Language = language, LessonId = lesson, IsCompleted = completed && lesson == "hello", XpAwarded = completed && lesson == "hello" ? 10 : 0, CompletedAt = completed && lesson == "hello" ? now : null });
        }
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
    }
}
