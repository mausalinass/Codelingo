using System.ComponentModel.DataAnnotations;
namespace Codelingo.Api.Dtos;
public sealed class EvaluateRequest
{
    public Guid UserId { get; set; }
    [Required, MaxLength(20)] public string Language { get; set; } = "";
    [Required, MaxLength(50)] public string LessonId { get; set; } = "";
    [Required, MaxLength(50)] public string ExerciseId { get; set; } = "";
    [Required(AllowEmptyStrings = true), MaxLength(5000)] public string Answer { get; set; } = null!;
}
