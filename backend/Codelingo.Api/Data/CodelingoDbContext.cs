using Codelingo.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
namespace Codelingo.Api.Data;

public sealed class CodelingoDbContext(DbContextOptions<CodelingoDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserStreak> UserStreaks => Set<UserStreak>();
    public DbSet<LanguageProgress> LanguageProgress => Set<LanguageProgress>();
    public DbSet<LessonProgress> LessonProgress => Set<LessonProgress>();
    public DbSet<SwellProfile> SwellProfiles => Set<SwellProfile>();
    public DbSet<ExerciseAttempt> ExerciseAttempts => Set<ExerciseAttempt>();
    public DbSet<UserPreferences> UserPreferences => Set<UserPreferences>();
    public DbSet<PlacementResult> PlacementResults => Set<PlacementResult>();
    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().ToTable("users", t => t.HasCheckConstraint("chk_active_language", "active_language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')"));
        b.Entity<User>().Property(x => x.DisplayName).HasMaxLength(100);
        b.Entity<User>().Property(x => x.Email).HasMaxLength(255);
        b.Entity<User>().HasIndex(x => x.Email).IsUnique();
        b.Entity<User>().Property(x => x.ActiveLanguage).HasMaxLength(20);
        b.Entity<UserStreak>().ToTable("user_streaks");
        b.Entity<UserStreak>().HasKey(x => x.UserId);
        b.Entity<UserStreak>().HasOne<User>().WithOne().HasForeignKey<UserStreak>(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<LanguageProgress>().ToTable("language_progress", t => t.HasCheckConstraint("chk_progress_language", "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')"));
        b.Entity<LanguageProgress>().HasIndex(x => new { x.UserId, x.Language }).IsUnique();
        b.Entity<LanguageProgress>().Property(x => x.CompletionPercentage).HasPrecision(5, 2);
        b.Entity<LanguageProgress>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<LessonProgress>().ToTable("lesson_progress", t => t.HasCheckConstraint("chk_lesson_language", "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')"));
        b.Entity<LessonProgress>().HasIndex(x => new { x.UserId, x.Language, x.LessonId }).IsUnique();
        b.Entity<LessonProgress>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<SwellProfile>().ToTable("swell_profiles", t => t.HasCheckConstraint("chk_personality", "primary_trait IN ('ANALYTICAL','PRACTICAL','VISUAL')"));
        b.Entity<SwellProfile>().HasOne<User>().WithOne().HasForeignKey<SwellProfile>(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<SwellProfile>().HasIndex(x => x.UserId).IsUnique();
        b.Entity<SwellProfile>().Property(x => x.RawPayload).HasColumnType("jsonb");
        b.Entity<SwellProfile>().Property(x => x.PrimaryTrait).HasMaxLength(30);
        b.Entity<SwellProfile>().Property(x => x.SwellExternalId).HasMaxLength(100);
        b.Entity<SwellProfile>().Property(x => x.AnalyticalScore).HasPrecision(5, 2);
        b.Entity<SwellProfile>().Property(x => x.PracticalScore).HasPrecision(5, 2);
        b.Entity<SwellProfile>().Property(x => x.VisualScore).HasPrecision(5, 2);
        b.Entity<ExerciseAttempt>().ToTable("exercise_attempts", t => t.HasCheckConstraint("chk_attempt_language", "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')"));
        b.Entity<ExerciseAttempt>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<ExerciseAttempt>().HasIndex(x => x.UserId);
        b.Entity<ExerciseAttempt>().HasIndex(x => x.AttemptedAt);
        b.Entity<UserPreferences>().ToTable("user_preferences", t =>
        {
            t.HasCheckConstraint("chk_preferences_locale", "ui_language IN ('es','en')");
            t.HasCheckConstraint("chk_preferences_language", "programming_language IN ('python','javascript','typescript','csharp')");
            t.HasCheckConstraint("chk_preferences_experience", "experience_level IN ('beginner','basic','intermediate','project_experience')");
        });
        b.Entity<UserPreferences>().HasKey(x => x.UserId);
        b.Entity<UserPreferences>().HasOne<User>().WithOne().HasForeignKey<UserPreferences>(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<PlacementResult>().ToTable("placement_results", t => t.HasCheckConstraint("chk_placement_language", "language IN ('python','javascript','typescript','csharp')"));
        b.Entity<PlacementResult>().HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<PlacementResult>().HasIndex(x => new { x.UserId, x.CompletedAt });
        foreach (var entity in b.Model.GetEntityTypes())
        foreach (var property in entity.GetProperties())
        {
            property.SetColumnName(Regex.Replace(property.Name, "([a-z0-9])([A-Z])", "$1_$2").ToLowerInvariant());
            if (property.Name == "Language") property.SetMaxLength(20);
            if (property.Name is "LessonId" or "ExerciseId") property.SetMaxLength(50);
        }
    }
}
