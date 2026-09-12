using Codelingo.Api.Curriculum;
using Codelingo.Api.Models;
using Codelingo.Api.Services;
using Codelingo.Api.Dtos;
using Microsoft.Extensions.Configuration;
namespace Codelingo.Api.Tests;
public class DomainTests
{
    public static TheoryData<string, string, string> Solutions => new()
    {
        { "python", "hello", "print('Hello, Louis!')" },
        { "python", "conditions", "if score >= 70:\r\n    print(\"Pass\")" },
        { "python", "loops", "for number in range(3):\n    print(number)" },
        { "javascript", "hello", "console.log('Hello, Louis!');" },
        { "javascript", "conditions", "if (score >= 70) { console.log('Pass'); }" },
        { "javascript", "loops", "for (let i = 0; i < 3; i++) { console.log(i); }" },
        { "csharp", "hello", "Console.WriteLine(\"Hello, Louis!\");" },
        { "csharp", "conditions", "if (age >= 18) { Console.WriteLine(\"Adult\"); }" },
        { "csharp", "loops", "for (int i = 0; i < 3; i++) { Console.WriteLine(i); }" }
    };
    public static IEnumerable<object[]> AllSolutions() => new CurriculumCatalog().Lessons.Select(l => new object[] { l.Language, l.Id, l.Exercise.SampleSolution });
    [Theory, MemberData(nameof(AllSolutions))]
    public void AcceptsAllEightySolutions(string language, string id, string answer)
    {
        var exercise = new CurriculumCatalog().Find(language, id)!.Exercise;
        var evaluator = new EvaluationService();
        Assert.True(evaluator.Evaluate(answer, exercise));
        Assert.True(evaluator.Evaluate("  \r\n" + answer.Replace("\n", "\r\n") + "\r\n ", exercise));
        Assert.False(evaluator.Evaluate("18", exercise));
        Assert.False(evaluator.Evaluate("wrong answer", exercise));
    }
    [Fact] public void CatalogHasEightyDistinctExercises()
    {
        var catalog = new CurriculumCatalog();
        Assert.Equal(80, catalog.Lessons.Count);
        Assert.Equal(80, catalog.Lessons.Select(x => x.Exercise.Id).Distinct().Count());
        Assert.All(CurriculumCatalog.Languages, language => Assert.Equal(10, catalog.ForLanguage(language).Length));
    }
    [Theory, MemberData(nameof(Solutions))]
    public void AcceptsRehearsedSolutions(string language, string id, string answer) => Assert.True(new EvaluationService().Evaluate(answer, new CurriculumCatalog().Find(language, id)!.Exercise));
    [Theory]
    [InlineData("")][InlineData("  ")][InlineData("Console.WriteLine(\"Adult\");")]
    [InlineData("if (age > 18) { Console.WriteLine(\"Adult\"); }")]
    [InlineData("if (age >= 18) { Console.WriteLine(\"Child\"); }")]
    public void RejectsMissingRequiredConcept(string answer) => Assert.False(new EvaluationService().Evaluate(answer, new CurriculumCatalog().Find("csharp", "conditions")!.Exercise));
    [Fact] public void RejectsOversizedAnswer() => Assert.False(new EvaluationService().Evaluate(new string('x', 5001), new CurriculumCatalog().Lessons[0].Exercise));
    [Theory]
    [InlineData(0.8, 0.8, 0.8, "ANALYTICAL")]
    [InlineData(0.1, 0.9, 0.9, "PRACTICAL")]
    [InlineData(0.1, 0.2, 0.9, "VISUAL")]
    public void PersonalityTieOrderIsStable(double a, double p, double v, string expected) => Assert.Equal(expected, PersonalityService.Normalize((decimal)a, (decimal)p, (decimal)v));
    [Theory][InlineData(0, 0)][InlineData(1, 33.33)][InlineData(2, 66.67)][InlineData(3, 100)]
    public void RoundsProgress(int count, double expected) => Assert.Equal((decimal)expected, ProgressService.Percentage(count, 3));
    [Theory][InlineData(0, 4)][InlineData(-1, 5)][InlineData(-2, 1)][InlineData(1, 1)]
    public void StreakHandlesDates(int offset, int expected)
    {
        var today = new DateOnly(2026, 9, 11);
        var streak = new UserStreak { CurrentStreak = 4, LongestStreak = 7, LastActivityDate = today.AddDays(offset) };
        StreakService.Apply(streak, today, DateTime.UtcNow);
        Assert.Equal(expected, streak.CurrentStreak); Assert.Equal(7, streak.LongestStreak); Assert.Equal(today, streak.LastActivityDate);
        StreakService.Apply(streak, today, DateTime.UtcNow); Assert.Equal(expected, streak.CurrentStreak);
    }
    [Fact] public void FirstActivityStartsStreakAndUpdatesLongest()
    {
        var streak = new UserStreak(); StreakService.Apply(streak, new(2026, 9, 11), DateTime.UtcNow);
        Assert.Equal(1, streak.CurrentStreak); Assert.Equal(1, streak.LongestStreak);
    }
    [Fact] public void LocalDateDoesNotChangeAtUtcMidnight()
    {
        var clock = new FixedClock(new DateTimeOffset(2026, 9, 12, 1, 0, 0, TimeSpan.Zero));
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?> { ["Demo:TimeZone"] = "America/New_York" }).Build();
        Assert.Equal(new DateOnly(2026, 9, 11), new StreakService(clock, config).Today);
    }
    [Fact] public void AdaptationPreservesExerciseAndChangesPresentation()
    {
        var lesson = new CurriculumCatalog().Find("csharp", "conditions")!;
        var service = new LessonService();
        var analytical = service.Build(lesson, new("SWELL_MOCK", "ANALYTICAL", "DEEP_EXPLANATION", new(0.88m, 0.41m, 0.52m)));
        var practical = service.Build(lesson, new("SWELL_MOCK", "PRACTICAL", "PRACTICE_FIRST", new(0.35m, 0.91m, 0.48m)));
        var visual = service.Build(lesson, new("SWELL_MOCK", "VISUAL", "VISUAL_GUIDED", new(0.35m, 0.48m, 0.91m)));
        Assert.Equal(analytical.Exercise.Id, practical.Exercise.Id); Assert.True(analytical.ShowExplanationFirst);
        Assert.Null(practical.Explanation); Assert.False(practical.ShowExplanationFirst); Assert.NotEmpty(visual.VisualSteps);
    }
    private sealed class FixedClock(DateTimeOffset now) : TimeProvider { public override DateTimeOffset GetUtcNow() => now; }
}
