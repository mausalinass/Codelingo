using Codelingo.Api.Curriculum;
using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Controllers;
[ApiController, Route("api/evaluate")]
public sealed class EvaluationController(CodelingoDbContext db, CurriculumCatalog catalog, ProgressService progress) : ControllerBase
{
    [HttpPost, RequestSizeLimit(65536)]
    public async Task<ActionResult<EvaluateResponse>> Evaluate(EvaluateRequest request, CancellationToken ct)
    {
        if (request.UserId == Guid.Empty) return BadRequest(new { message = "userId is required." });
        if (!await db.Users.AnyAsync(x => x.Id == request.UserId, ct)) return NotFound(new { message = "Unknown user." });
        var lesson = catalog.Find(request.Language, request.LessonId);
        if (lesson is null) return NotFound(new { message = "Unknown language or lesson." });
        var validExerciseIds = Enumerable.Range(1, ProgressService.ProblemsPerLesson).Select(number => $"{lesson.Exercise.Id}-p{number}");
        if (!validExerciseIds.Contains(request.ExerciseId, StringComparer.Ordinal)) return NotFound(new { message = "Unknown exercise." });
        var result = await progress.EvaluateAsync(request, lesson, ct);
        return result is null ? NotFound(new { message = "Unknown user." }) : Ok(result);
    }
}
