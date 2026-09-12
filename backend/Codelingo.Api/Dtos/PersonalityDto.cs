namespace Codelingo.Api.Dtos;
public sealed record PersonalityDto(string Source, string PrimaryTrait, string LearningMode, PersonalityScores Scores);
public sealed record PersonalityScores(decimal Analytical, decimal Practical, decimal Visual);
