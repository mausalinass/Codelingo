using Codelingo.Api.Curriculum;
using Codelingo.Api.Dtos;
namespace Codelingo.Api.Services;
public sealed class LessonService
{
    public AdaptiveLessonDto Build(LessonDefinition lesson, PersonalityDto profile)
    {
        var analytical = profile.PrimaryTrait == "ANALYTICAL";
        var practical = profile.PrimaryTrait == "PRACTICAL";
        var message = practical ? "No lecture. Let's code it." : analytical
            ? lesson.Id == "conditions" ? "Let's inspect how a Boolean condition controls program flow." : "Let's inspect how this instruction changes program flow."
            : "Follow each step with me, then try the code.";
        var problems = ProblemSet.CreateAll(lesson, profile.LearningMode)
            .Select(problem => new ProblemDto(problem.Id, problem.Prompt, problem.Goal, problem.StarterCode, problem.VisualSteps)).ToArray();
        return new(lesson.Id, lesson.Language, profile.PrimaryTrait, profile.LearningMode, lesson.Title, message,
            practical ? null : analytical ? lesson.ConceptExplanation : string.Join(". ", lesson.VisualSteps) + ".",
            lesson.VisualSteps, analytical, new(lesson.Exercise.Id, "CODE", problems[0].Prompt, problems[0].StarterCode, problems));
    }
}
