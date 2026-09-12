using System.Text.RegularExpressions;
using Codelingo.Api.Curriculum;
namespace Codelingo.Api.Services;
public sealed class EvaluationService
{
    public bool Evaluate(string? answer, ExerciseDefinition exercise)
    {
        if (string.IsNullOrWhiteSpace(answer) || answer.Length > 5000 || exercise.RequiredPatterns.Length == 0) return false;
        var normalized = answer.Replace("\r\n", "\n").Trim();
        try
        {
            // Case-sensitive language constructs; timeout bounds every controlled pattern.
            return exercise.RequiredPatterns.All(pattern => Regex.IsMatch(normalized, pattern, RegexOptions.Multiline | RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(100)));
        }
        catch (RegexMatchTimeoutException) { return false; }
    }
}
