namespace Codelingo.Api.Dtos;
public sealed record DashboardDto(DashboardUser User, DashboardStreak Streak, string ActiveLanguage, CourseProgress[] Courses);
public sealed record DashboardUser(Guid Id, string DisplayName, int TotalXp);
public sealed record DashboardStreak(int Current, int Longest);
public sealed record CourseProgress(string Language, int CompletedLessons, int TotalLessons, decimal Percentage, LessonStateDto[] Lessons);
public sealed record LessonStateDto(string Id, string Title, string Description, int Order, string Status);
