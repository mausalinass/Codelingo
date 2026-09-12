using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Controllers;
[ApiController, Route("api/users/{userId:guid}")]
public sealed class UsersController(CodelingoDbContext db, PersonalityService personality) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardDto>> Dashboard(Guid userId, CancellationToken ct)
    {
        // One snapshot prevents a concurrent completion from mixing old XP and new progress.
        await using var tx = await db.Database.BeginTransactionAsync(System.Data.IsolationLevel.RepeatableRead, ct);
        var user = await db.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == userId, ct);
        if (user is null) return NotFound(new { message = "Unknown user." });
        var streak = await db.UserStreaks.AsNoTracking().SingleAsync(x => x.UserId == userId, ct);
        var rows = await db.LanguageProgress.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var courses = Curriculum.CurriculumCatalog.Languages.Select(language => rows.Single(x => x.Language == language)).Select(x => new CourseProgress(x.Language, x.CompletedLessons, x.TotalLessons, x.CompletionPercentage)).ToArray();
        await tx.CommitAsync(ct);
        return new DashboardDto(new(user.Id, user.DisplayName, user.TotalXp), new(streak.CurrentStreak, streak.LongestStreak), user.ActiveLanguage, courses);
    }
    [HttpGet("personality")]
    public async Task<ActionResult<PersonalityDto>> Personality(Guid userId, CancellationToken ct)
    {
        var result = await personality.GetAsync(userId, ct);
        return result is null ? NotFound(new { message = "Unknown user." }) : Ok(result);
    }
}
