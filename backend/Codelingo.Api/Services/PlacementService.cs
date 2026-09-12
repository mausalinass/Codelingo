using Codelingo.Api.Dtos;

namespace Codelingo.Api.Services;

public sealed class PlacementService
{
    private static readonly Dictionary<string, string> Answers = new(StringComparer.OrdinalIgnoreCase)
    {
        ["q1"] = "12", ["q2"] = "5", ["q3"] = "Age is at least 18", ["q4"] = "3", ["q5"] = "6"
    };

    public static int Score(IEnumerable<PlacementAnswerDto> answers) => answers
        .Select(a => (Suffix: a.QuestionId.Split('-').Last(), a.Answer))
        .Count(a => Answers.TryGetValue(a.Suffix, out var expected) && string.Equals(expected, a.Answer, StringComparison.OrdinalIgnoreCase));

    public static string Recommend(int score) => score switch { <= 1 => "hello", <= 3 => "variables", 4 => "conditions", _ => "functions" };
}
