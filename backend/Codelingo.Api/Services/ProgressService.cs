using Codelingo.Api.Curriculum;
using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Services;
public sealed class ProgressService(CodelingoDbContext db, EvaluationService evaluator, StreakService dates, CurriculumCatalog catalog)
{
    public const int ProblemsPerLesson = 10;
    public static decimal Percentage(int completed, int total) => total <= 0 ? 0 : Math.Round(completed * 100m / total, 2, MidpointRounding.AwayFromZero);
    public async Task<EvaluateResponse?> EvaluateAsync(EvaluateRequest request, LessonDefinition lesson, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        // PostgreSQL row lock serializes completions across processes, lessons, and simultaneous retries.
        var user = await db.Users.FromSqlInterpolated($"SELECT * FROM users WHERE id = {request.UserId} FOR UPDATE").SingleOrDefaultAsync(ct);
        if (user is null) return null;
        var progress = await db.LanguageProgress.SingleAsync(x => x.UserId == user.Id && x.Language == request.Language, ct);
        var streak = await db.UserStreaks.SingleAsync(x => x.UserId == user.Id, ct);
        var completion = await db.LessonProgress.SingleOrDefaultAsync(x => x.UserId == user.Id && x.Language == request.Language && x.LessonId == request.LessonId, ct);
        var correct = evaluator.Evaluate(request.Answer, lesson.Exercise);
        var earlierAttempts = await db.ExerciseAttempts
            .Where(x => x.UserId == user.Id && x.Language == request.Language && x.LessonId == request.LessonId && x.ExerciseId.StartsWith(lesson.Exercise.Id + "-p"))
            .Select(x => new { x.ExerciseId, x.IsCorrect })
            .ToListAsync(ct);
        var attemptsForProblem = earlierAttempts.Count(x => x.ExerciseId == request.ExerciseId) + 1;
        var advanceRequired = correct || attemptsForProblem >= 3;
        var attemptsWithCurrent = earlierAttempts
            .Append(new { request.ExerciseId, IsCorrect = correct })
            .GroupBy(x => x.ExerciseId)
            .Count(group => group.Any(x => x.IsCorrect) || group.Count() >= 3);
        var previous = streak.CurrentStreak;
        var awarded = 0;
        var now = DateTime.UtcNow;
        if (attemptsWithCurrent >= ProblemsPerLesson && completion?.IsCompleted != true)
        {
            if (completion is null)
            {
                completion = new() { UserId = user.Id, Language = request.Language, LessonId = request.LessonId };
                db.LessonProgress.Add(completion);
            }
            awarded = lesson.Exercise.XpReward;
            completion.IsCompleted = true; completion.CompletedAt = now; completion.XpAwarded = awarded;
            user.TotalXp += awarded; user.UpdatedAt = now;
            progress.Xp += awarded;
            // Count persisted completions before adding the newly completed lesson.
            progress.CompletedLessons = await db.LessonProgress.CountAsync(x => x.UserId == user.Id && x.Language == request.Language && x.IsCompleted, ct) + 1;
            progress.TotalLessons = catalog.ForLanguage(request.Language).Length;
            progress.CompletionPercentage = Percentage(progress.CompletedLessons, progress.TotalLessons);
            var completedIds = await db.LessonProgress.Where(x => x.UserId == user.Id && x.Language == request.Language && x.IsCompleted).Select(x => x.LessonId).ToListAsync(ct);
            completedIds.Add(request.LessonId);
            var route = catalog.ForLanguage(request.Language);
            var firstIncomplete = Array.FindIndex(route, x => !completedIds.Contains(x.Id));
            progress.CurrentLesson = firstIncomplete < 0 ? route.Length : firstIncomplete + 1;
            progress.UpdatedAt = now;
            StreakService.Apply(streak, dates.Today, now);
        }
        db.ExerciseAttempts.Add(new() { UserId = user.Id, Language = request.Language, LessonId = request.LessonId, ExerciseId = request.ExerciseId, SubmittedAnswer = request.Answer, IsCorrect = correct, XpAwarded = awarded, AttemptedAt = now });
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
        var message = !correct && !advanceRequired ? $"Review the concept and try again. {3 - attemptsForProblem} attempts remaining."
            : !correct ? "Three attempts used. Review the correct answer before moving to the next problem."
            : attemptsWithCurrent < ProblemsPerLesson ? $"Correct! Problem {attemptsWithCurrent} of {ProblemsPerLesson} resolved."
            : awarded == 0 ? "Correct again! This lesson is already complete, so no extra XP was awarded."
            : "Nice work. You completed all ten problems and activated today's learning streak!";
        return new(correct, awarded, new(correct ? "Correct!" : advanceRequired ? "Correct answer" : "Try again", message), new(completion?.IsCompleted == true, progress.CompletionPercentage), new(previous, streak.CurrentStreak, streak.CurrentStreak > previous), attemptsForProblem, advanceRequired, !correct && advanceRequired ? lesson.Exercise.SampleSolution : null, attemptsWithCurrent, ProblemsPerLesson);
    }
}
