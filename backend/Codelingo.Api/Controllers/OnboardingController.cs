using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Models;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Codelingo.Api.Controllers;

[ApiController]
[Route("api/onboarding")]
public sealed class OnboardingController(CodelingoDbContext db, IWebHostEnvironment environment) : ControllerBase
{
    private static readonly HashSet<string> Languages = ["python", "javascript", "typescript", "csharp"];
    private static readonly HashSet<string> Locales = ["es", "en"];
    private static readonly HashSet<string> Levels = ["beginner", "basic", "intermediate", "project_experience"];

    [HttpPost("preferences")]
    public async Task<ActionResult<OnboardingDto>> Preferences(OnboardingPreferencesRequest request, CancellationToken ct)
    {
        if (!DemoAllowed(request.UserId)) return NotFound();
        if (!Locales.Contains(request.UiLanguage) || !Languages.Contains(request.ProgrammingLanguage) || !Levels.Contains(request.ExperienceLevel)) return BadRequest(new { message = "Unsupported onboarding selection." });
        if (!await db.Users.AnyAsync(x => x.Id == request.UserId, ct)) return NotFound();
        var value = await db.UserPreferences.FindAsync([request.UserId], ct) ?? new UserPreferences { UserId = request.UserId };
        value.UiLanguage = request.UiLanguage; value.ProgrammingLanguage = request.ProgrammingLanguage; value.ExperienceLevel = request.ExperienceLevel; value.UpdatedAt = DateTime.UtcNow;
        if (db.Entry(value).State == EntityState.Detached) db.UserPreferences.Add(value);
        await db.SaveChangesAsync(ct);
        return await GetState(request.UserId, ct);
    }

    [HttpPost("placement")]
    public async Task<ActionResult<PlacementDto>> Placement(PlacementRequest request, CancellationToken ct)
    {
        if (!DemoAllowed(request.UserId)) return NotFound();
        if (!Languages.Contains(request.Language) || request.Answers.Length != 5 || request.Answers.Select(x => x.QuestionId).Distinct().Count() != 5) return BadRequest(new { message = "Exactly five unique placement answers are required." });
        if (!await db.Users.AnyAsync(x => x.Id == request.UserId, ct)) return NotFound();
        var score = PlacementService.Score(request.Answers); var lesson = PlacementService.Recommend(score);
        db.PlacementResults.Add(new PlacementResult { UserId = request.UserId, Language = request.Language, CorrectAnswers = score, RecommendedLessonId = lesson });
        await db.SaveChangesAsync(ct);
        return new PlacementDto(score, 5, lesson, char.ToUpperInvariant(lesson[0]) + lesson[1..]);
    }

    [HttpPost("complete")]
    public async Task<ActionResult<OnboardingDto>> Complete(OnboardingCompleteRequest request, CancellationToken ct)
    {
        if (!DemoAllowed(request.UserId)) return NotFound();
        if (!new[] { "hello", "variables", "conditions", "functions" }.Contains(request.StartingLessonId)) return BadRequest();
        var value = await db.UserPreferences.FindAsync([request.UserId], ct); if (value is null) return NotFound();
        value.StartingLessonId = request.StartingLessonId; value.OnboardingCompleted = true; value.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct); return await GetState(request.UserId, ct);
    }

    [HttpGet("/api/users/{userId:guid}/onboarding")]
    public async Task<ActionResult<OnboardingDto>> Get(Guid userId, CancellationToken ct) => DemoAllowed(userId) ? await GetState(userId, ct) : NotFound();

    private bool DemoAllowed(Guid userId) => environment.IsDevelopment() && userId == DemoSeed.UserId;

    private async Task<ActionResult<OnboardingDto>> GetState(Guid userId, CancellationToken ct)
    {
        var prefs = await db.UserPreferences.AsNoTracking().SingleOrDefaultAsync(x => x.UserId == userId, ct); if (prefs is null) return NotFound();
        var result = await db.PlacementResults.AsNoTracking().Where(x => x.UserId == userId).OrderByDescending(x => x.CompletedAt).FirstOrDefaultAsync(ct);
        return new OnboardingDto(prefs.UiLanguage, prefs.ProgrammingLanguage, prefs.ExperienceLevel, prefs.OnboardingCompleted, prefs.StartingLessonId, result?.CorrectAnswers, result?.TotalQuestions, result?.RecommendedLessonId);
    }
}
