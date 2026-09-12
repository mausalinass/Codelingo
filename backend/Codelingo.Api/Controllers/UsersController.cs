using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Controllers;
[ApiController, Route("api/users/{userId:guid}")]
public sealed class UsersController(CodelingoDbContext db, PersonalityService personality, Curriculum.CurriculumCatalog catalog) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardDto>> Dashboard(Guid userId, CancellationToken ct)
    {
        // One snapshot prevents a concurrent completion from mixing old XP and new progress.
        await using var tx = await db.Database.BeginTransactionAsync(System.Data.IsolationLevel.RepeatableRead, ct);
        var user = await db.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == userId, ct);
        if (user is null) return NotFound(new { message = "Unknown user." });
        var streak = await db.UserStreaks.AsNoTracking().SingleAsync(x => x.UserId == userId, ct);
        var completed = await db.LessonProgress.AsNoTracking().Where(x => x.UserId == userId && x.IsCompleted).ToListAsync(ct);
        var courses = Curriculum.CurriculumCatalog.Languages.Select(language =>
        {
            var route = catalog.ForLanguage(language);
            var ids = completed.Where(x => x.Language == language).Select(x => x.LessonId).ToHashSet();
            var firstIncomplete = Array.FindIndex(route, x => !ids.Contains(x.Id));
            var states = route.Select((lesson, index) => new LessonStateDto(lesson.Id, lesson.Title, lesson.ConceptExplanation.Split(". ")[0] + ".",
                index + 1, ids.Contains(lesson.Id) ? "completed" : index == firstIncomplete ? "current" : "locked")).ToArray();
            var count = states.Count(x => x.Status == "completed");
            return new CourseProgress(language, count, route.Length, ProgressService.Percentage(count, route.Length), states);
        }).ToArray();
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
