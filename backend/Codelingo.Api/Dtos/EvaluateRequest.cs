using System.ComponentModel.DataAnnotations;
namespace Codelingo.Api.Dtos;
public sealed class EvaluateRequest
{
    public Guid UserId { get; set; }
    [Required, MaxLength(20)] public string Language { get; set; } = "";
    [Required, MaxLength(50)] public string LessonId { get; set; } = "";
    [Required, MaxLength(50)] public string ExerciseId { get; set; } = "";
    [MaxLength(30)] public string PresentationMode { get; set; } = "DEEP_EXPLANATION";
    [Required(AllowEmptyStrings = true), MaxLength(5000)] public string Answer { get; set; } = null!;
}
