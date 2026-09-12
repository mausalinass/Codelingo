using Codelingo.Api.Curriculum;
using Codelingo.Api.Data;
using Codelingo.Api.Services;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders(); builder.Logging.AddConsole();
builder.Services.AddControllers(); builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer(); builder.Services.AddSwaggerGen();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<CurriculumCatalog>(); builder.Services.AddSingleton<LessonService>(); builder.Services.AddSingleton<EvaluationService>();
builder.Services.AddScoped<StreakService>(); builder.Services.AddScoped<DemoSeed>(); builder.Services.AddScoped<ProgressService>();
builder.Services.AddScoped<ISwellPersonalityProvider, MockSwellPersonalityProvider>(); builder.Services.AddScoped<PersonalityService>();
var connection = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<CodelingoDbContext>(o => o.UseNpgsql(connection ?? "Host=localhost;Port=5432;Database=codelingo;Username=codelingo"));
var origins = builder.Environment.IsDevelopment() ? new[] { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" } : Array.Empty<string>();
if (!string.IsNullOrWhiteSpace(builder.Configuration["FrontendOrigin"])) origins = [.. origins, builder.Configuration["FrontendOrigin"]!];
builder.Services.AddCors(o => o.AddPolicy("Frontend", p => { if (origins.Length > 0) p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod(); }));
var app = builder.Build();
app.UseExceptionHandler(error => error.Run(async context =>
{
    context.Response.StatusCode = 500;
    await context.Response.WriteAsJsonAsync(new { message = "An unexpected server error occurred." });
}));
app.UseCors("Frontend");
if (app.Environment.IsDevelopment()) { app.MapOpenApi(); app.UseSwagger(); app.UseSwaggerUI(); }
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/health/ready", async (CodelingoDbContext db, CancellationToken ct) =>
    await db.Database.CanConnectAsync(ct) ? Results.Ok(new { status = "ready" }) : Results.Json(new { status = "database unavailable" }, statusCode: 503));
app.MapControllers();
if (builder.Configuration.GetValue<bool>("Database:Initialize"))
{
    if (string.IsNullOrWhiteSpace(connection)) throw new InvalidOperationException("Set ConnectionStrings__Default before initializing PostgreSQL.");
    await using var scope = app.Services.CreateAsyncScope();
    await scope.ServiceProvider.GetRequiredService<CodelingoDbContext>().Database.MigrateAsync();
    await scope.ServiceProvider.GetRequiredService<DemoSeed>().EnsureAsync();
}
app.Run();
public partial class Program { }
