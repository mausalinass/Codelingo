namespace Codelingo.Api.Curriculum;
public sealed record ExerciseDefinition(string Id, string Prompt, string StarterCode, string[] RequiredPatterns, int XpReward = 10);
public sealed record LessonDefinition(string Id, string Language, string Title, string ConceptExplanation, string[] VisualSteps, ExerciseDefinition Exercise);
public sealed class CurriculumCatalog
{
    public IReadOnlyList<LessonDefinition> Lessons { get; } = [.. PythonLessons.All, .. JavaScriptLessons.All, .. CSharpLessons.All];
    public LessonDefinition? Find(string language, string id) => Lessons.SingleOrDefault(x => x.Language == language && x.Id == id);
    public static readonly string[] Languages = ["python", "javascript", "csharp"];
}
