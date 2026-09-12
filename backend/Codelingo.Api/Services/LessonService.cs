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
        // All modes submit a complete answer to the same evaluator. CODE avoids an ambiguous blank-substitution contract.
        return new(lesson.Id, lesson.Language, profile.PrimaryTrait, profile.LearningMode, lesson.Title, message,
            practical ? null : analytical ? lesson.ConceptExplanation : string.Join(". ", lesson.VisualSteps) + ".",
            lesson.VisualSteps, analytical, new(lesson.Exercise.Id, "CODE", lesson.Exercise.Prompt, lesson.Exercise.StarterCode));
    }
}
