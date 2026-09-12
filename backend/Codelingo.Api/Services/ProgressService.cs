using Codelingo.Api.Curriculum;
using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace Codelingo.Api.Services;
public sealed class ProgressService(CodelingoDbContext db, EvaluationService evaluator, StreakService dates)
{
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
        var previous = streak.CurrentStreak;
        var awarded = 0;
        var now = DateTime.UtcNow;
        if (correct && completion?.IsCompleted != true)
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
            progress.TotalLessons = 3;
            progress.CompletionPercentage = Percentage(progress.CompletedLessons, progress.TotalLessons);
            progress.CurrentLesson = Math.Min(progress.CompletedLessons + 1, 3);
            progress.UpdatedAt = now;
            StreakService.Apply(streak, dates.Today, now);
        }
        db.ExerciseAttempts.Add(new() { UserId = user.Id, Language = request.Language, LessonId = request.LessonId, ExerciseId = request.ExerciseId, SubmittedAnswer = request.Answer, IsCorrect = correct, XpAwarded = awarded, AttemptedAt = now });
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
        var message = !correct ? "Check the requested condition, output text, and punctuation, then try again."
            : awarded == 0 ? "Correct again! This lesson is already complete, so no extra XP was awarded."
            : request.Language == "csharp" && request.LessonId == "conditions" ? "Nice work. Your condition checks whether age is at least 18."
            : "Nice work. You completed the lesson!";
        return new(correct, awarded, new(correct ? "Correct!" : "Try again", message), new(completion?.IsCompleted == true, progress.CompletionPercentage), new(previous, streak.CurrentStreak, streak.CurrentStreak > previous));
    }
}
