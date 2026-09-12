namespace Codelingo.Api.Curriculum;

public sealed record ProblemVariant(string Id, string Prompt, string Goal, string StarterCode, string[] VisualSteps, ExerciseDefinition Exercise);

public static class ProblemSet
{
    private static readonly string[] Messages = ["Hello, Louis!", "Welcome, coder!", "Practice makes progress.", "Code one step at a time.", "Debug with patience.", "I can solve this!", "Learning is a superpower.", "Build, test, improve.", "Small steps, big skills.", "Challenge complete!"];
    private static readonly string[] Names = ["score", "points", "level", "lives", "coins", "streak", "attempts", "lessons", "badges", "rank"];
    private static readonly string[] Values = ["100", "25", "3", "5", "40", "7", "2", "10", "6", "9"];
    private static readonly string[] Thresholds = ["70", "50", "3", "5", "40", "7", "2", "10", "6", "9"];
    private static readonly string[] Outcomes = ["Pass", "Ready", "Unlocked", "Active", "Qualified", "On fire", "Retry", "Complete", "Earned", "Promoted"];
    private static readonly string[] FunctionNames = ["add", "sum", "combine", "total", "addValues", "calculateSum", "mergeScores", "sumPoints", "plus", "getTotal"];
    private static readonly string[] Limits = ["3", "4", "5", "6", "7", "8", "9", "10", "2", "12"];
    private static readonly string[] CollectionNames = ["numbers", "scores", "levels", "points", "values", "ages", "steps", "items", "totals", "results"];
    private static readonly string[] ClassNames = ["Bird", "Cardinal", "Student", "Course", "Badge", "Lesson", "Coach", "Challenge", "Profile", "Track"];
    private static readonly string[] AsyncNames = ["greet", "welcome", "loadMessage", "fetchGreeting", "getStatus", "loadLesson", "fetchTip", "getResult", "loadProfile", "finishTask"];
    private static readonly string[] GenericNames = ["identity", "keep", "same", "preserve", "echo", "returnValue", "passThrough", "copyValue", "unchanged", "retain"];

    public static ProblemVariant Create(LessonDefinition lesson, int number, string? presentationMode)
    {
        if (number is < 1 or > 10) throw new ArgumentOutOfRangeException(nameof(number));
        var i = number - 1;
        var sample = lesson.Exercise.SampleSolution;
        string task;

        switch (lesson.Id)
        {
            case "hello":
                sample = sample.Replace("Hello, Louis!", Messages[i], StringComparison.Ordinal);
                task = $"Display exactly \"{Messages[i]}\" using the language output function.";
                break;
            case "variables":
                sample = sample.Replace("score", Names[i], StringComparison.Ordinal).Replace("100", Values[i], StringComparison.Ordinal);
                task = $"Declare the integer variable {Names[i]} and initialize it to {Values[i]}.";
                break;
            case "conditions":
                var variable = sample.Contains("age", StringComparison.Ordinal) ? "age" : "score";
                var originalThreshold = variable == "age" ? "18" : "70";
                var originalOutcome = variable == "age" ? "Adult" : "Pass";
                var conditionNames = new[] { variable, "points", "level", "lives", "coins", "streak", "attempts", "lessons", "badges", "rank" };
                sample = sample.Replace(variable, conditionNames[i], StringComparison.Ordinal)
                    .Replace(originalThreshold, Thresholds[i], StringComparison.Ordinal)
                    .Replace(originalOutcome, Outcomes[i], StringComparison.Ordinal);
                task = $"If {conditionNames[i]} is greater than or equal to {Thresholds[i]}, display \"{Outcomes[i]}\".";
                break;
            case "functions":
                var baseFunction = sample.Contains("Add", StringComparison.Ordinal) ? "Add" : "add";
                var functionName = baseFunction == "Add" ? Capitalize(FunctionNames[i]) : FunctionNames[i];
                sample = sample.Replace(baseFunction, functionName, StringComparison.Ordinal);
                task = $"Define {functionName}(a, b) so it returns the sum of a and b.";
                break;
            case "loops":
                sample = sample.Replace("3", Limits[i], StringComparison.Ordinal);
                task = $"Loop from zero up to, but excluding, {Limits[i]} and display each index.";
                break;
            case "arrays":
                sample = sample.Replace("numbers", CollectionNames[i], StringComparison.Ordinal);
                task = $"Create {CollectionNames[i]} containing 1, 2 and 3, then display its first item.";
                break;
            case "oop":
                sample = sample.Replace("Bird", ClassNames[i], StringComparison.Ordinal);
                task = $"Define {ClassNames[i]} with a string name field or property.";
                break;
            case "async":
                var baseAsync = sample.Contains("GreetAsync", StringComparison.Ordinal) ? "GreetAsync" : sample.Contains("greet", StringComparison.Ordinal) ? "greet" : "greeting";
                var asyncName = baseAsync == "GreetAsync" ? Capitalize(AsyncNames[i]) + "Async" : AsyncNames[i];
                sample = sample.Replace(baseAsync, asyncName, StringComparison.Ordinal).Replace("Hello", Messages[i], StringComparison.Ordinal);
                task = $"Create the asynchronous operation {asyncName} that produces \"{Messages[i]}\".";
                break;
            case "errors":
                var badInput = $"bad-{number}";
                sample = sample.Replace("\"invalid\"", $"\"{badInput}\"", StringComparison.Ordinal)
                    .Replace("Invalid number", $"Invalid value {number}", StringComparison.Ordinal)
                    .Replace("Invalid JSON", $"Invalid data {number}", StringComparison.Ordinal);
                task = $"Handle the invalid input \"{badInput}\" and display the lesson's error message for variation {number}.";
                break;
            case "generics":
                var baseGeneric = sample.Contains("Identity", StringComparison.Ordinal) ? "Identity" : "identity";
                var genericName = baseGeneric == "Identity" ? Capitalize(GenericNames[i]) : GenericNames[i];
                sample = sample.Replace(baseGeneric, genericName, StringComparison.Ordinal);
                task = $"Define the generic function {genericName} so it returns its input unchanged.";
                break;
            default:
                task = $"Complete variation {number}: {lesson.Exercise.Prompt}";
                break;
        }

        var style = presentationMode switch
        {
            "PRACTICE_FIRST" => $"Build it directly — {task}",
            "VISUAL_GUIDED" => $"Follow the flow INPUT → LOGIC → OUTPUT — {task}",
            _ => $"Analyze the requirement, identify the exact syntax, then implement it — {task}"
        };
        var steps = presentationMode == "VISUAL_GUIDED"
            ? new[] { $"INPUT: read the values for problem {number}", $"LOGIC: apply {lesson.Title}", "OUTPUT: verify the requested result" }
            : lesson.VisualSteps;
        var exercise = lesson.Exercise with { Prompt = style, StarterCode = "", SampleSolution = sample, RequiredPatterns = [CurriculumCatalog.ExactSnippetPattern(sample)] };
        return new($"{lesson.Exercise.Id}-p{number}", style, task, "", steps, exercise);
    }

    public static ProblemVariant[] CreateAll(LessonDefinition lesson, string? presentationMode) =>
        Enumerable.Range(1, 10).Select(number => Create(lesson, number, presentationMode)).ToArray();

    private static string Capitalize(string value) => char.ToUpperInvariant(value[0]) + value[1..];
}
