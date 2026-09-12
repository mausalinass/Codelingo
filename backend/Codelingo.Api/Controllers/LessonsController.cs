using Codelingo.Api.Curriculum;
using Codelingo.Api.Dtos;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
namespace Codelingo.Api.Controllers;
[ApiController, Route("api/lessons")]
public sealed class LessonsController(CurriculumCatalog catalog, PersonalityService personality, LessonService lessons) : ControllerBase
{
    [HttpGet("{language}/{lessonId}")]
    public async Task<ActionResult<AdaptiveLessonDto>> Get(string language, string lessonId, [FromQuery] Guid userId, CancellationToken ct)
    {
        if (userId == Guid.Empty) return BadRequest(new { message = "userId is required." });
        var lesson = catalog.Find(language, lessonId);
        if (lesson is null) return NotFound(new { message = "Unknown language or lesson." });
        var profile = await personality.GetAsync(userId, ct);
        if (profile is null) return NotFound(new { message = "Unknown user." });
        return lessons.Build(lesson, profile);
    }
}
