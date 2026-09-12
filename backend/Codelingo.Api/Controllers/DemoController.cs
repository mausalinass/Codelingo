using Codelingo.Api.Data;
using Codelingo.Api.Dtos;
using Codelingo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
namespace Codelingo.Api.Controllers;
[ApiController, Route("api/demo/users/{userId:guid}")]
public sealed class DemoController(PersonalityService personality, DemoSeed seed, IConfiguration config, IWebHostEnvironment env) : ControllerBase
{
    private bool Allowed()
    {
        if (!config.GetValue<bool>("Demo:Enabled")) return false;
        if (env.IsDevelopment()) return true;
        var key = config["Demo:ApiKey"];
        var supplied = Request.Headers["X-Demo-Key"].ToString();
        return !string.IsNullOrWhiteSpace(key) && CryptographicOperations.FixedTimeEquals(SHA256.HashData(Encoding.UTF8.GetBytes(key)), SHA256.HashData(Encoding.UTF8.GetBytes(supplied)));
    }
    [HttpPost("personality")]
    public async Task<ActionResult<PersonalityDto>> Switch(Guid userId, DemoPersonalityRequest request, CancellationToken ct)
    {
        if (!Allowed()) return NotFound();
        var result = await personality.SwitchAsync(userId, request.PrimaryTrait, ct);
        return result is null ? NotFound(new { message = "Unknown user." }) : Ok(result);
    }
    [HttpPost("reset")]
    public async Task<IActionResult> Reset(Guid userId, CancellationToken ct)
    {
        if (!Allowed()) return NotFound();
        if (userId != DemoSeed.UserId) return NotFound(new { message = "Only the fixed demo user can be reset." });
        await seed.ResetAsync(ct);
        return Ok(new { message = "Demo reset.", userId });
    }
}
