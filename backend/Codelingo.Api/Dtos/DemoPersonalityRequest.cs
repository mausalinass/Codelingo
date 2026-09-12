using System.ComponentModel.DataAnnotations;
namespace Codelingo.Api.Dtos;
public sealed class DemoPersonalityRequest
{
    [Required, RegularExpression("^(ANALYTICAL|PRACTICAL|VISUAL)$")]
    public string PrimaryTrait { get; set; } = "";
}
