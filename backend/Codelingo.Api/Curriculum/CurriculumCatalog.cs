using System.Text.Json;
using System.Text.RegularExpressions;
namespace Codelingo.Api.Curriculum;
public sealed record ExerciseDefinition(string Id, string Prompt, string StarterCode, string[] RequiredPatterns, int XpReward = 10, string SampleSolution = "");
public sealed record LessonDefinition(string Id, string Language, string Title, string ConceptExplanation, string[] VisualSteps, ExerciseDefinition Exercise);
public sealed class CurriculumCatalog
{
    public static readonly string[] Languages = ["python", "javascript", "typescript", "csharp", "go", "rust", "java", "cpp"];
    public IReadOnlyList<LessonDefinition> Lessons { get; }
    public CurriculumCatalog()
    {
        using var stream = typeof(CurriculumCatalog).Assembly.GetManifestResourceStream("Codelingo.Api.Curriculum.lessons.json")!;
        var definitions = JsonSerializer.Deserialize<LessonDefinition[]>(stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        var legacy = new[] { PythonLessons.All, JavaScriptLessons.All, CSharpLessons.All }.SelectMany(x => x).ToDictionary(x => (x.Language, x.Id));
        Lessons = definitions.Select(d => d with { Exercise = d.Exercise with {
            RequiredPatterns = legacy.TryGetValue((d.Language, d.Id), out var original) ? original.Exercise.RequiredPatterns : [SnippetPattern(d.Exercise.SampleSolution)]
        }}).ToArray();
    }
    // Controlled token sequence, with flexible spacing outside quoted strings. Never executes code.
    private static string SnippetPattern(string sample)
    {
        var tokens = Regex.Matches(sample, "\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|[A-Za-z_][A-Za-z_0-9]*|[0-9]+|[^\\s]", RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(100));
        return @"\A\s*" + string.Join(@"\s*", tokens.Select(t => Regex.Escape(t.Value))) + @"\s*\z";
    }
    public LessonDefinition? Find(string language, string id) => Lessons.SingleOrDefault(x => x.Language == language && x.Id == id);
    public LessonDefinition[] ForLanguage(string language) => Lessons.Where(x => x.Language == language).ToArray();
}
