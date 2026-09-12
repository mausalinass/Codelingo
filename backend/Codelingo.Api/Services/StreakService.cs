using Codelingo.Api.Models;
namespace Codelingo.Api.Services;
public sealed class StreakService(TimeProvider clock, IConfiguration config)
{
    public DateOnly Today => DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(clock.GetUtcNow(), TimeZoneInfo.FindSystemTimeZoneById(config["Demo:TimeZone"] ?? "America/New_York")).DateTime);
    public static void Apply(UserStreak streak, DateOnly today, DateTime now)
    {
        if (streak.LastActivityDate == today) return;
        streak.CurrentStreak = streak.LastActivityDate == today.AddDays(-1) ? streak.CurrentStreak + 1 : 1;
        streak.LongestStreak = Math.Max(streak.LongestStreak, streak.CurrentStreak);
        streak.LastActivityDate = today;
        streak.UpdatedAt = now;
    }
}
