using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Codelingo.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandCurriculum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "chk_active_language",
                table: "users");

            migrationBuilder.DropCheckConstraint(
                name: "chk_lesson_language",
                table: "lesson_progress");

            migrationBuilder.DropCheckConstraint(
                name: "chk_progress_language",
                table: "language_progress");

            migrationBuilder.DropCheckConstraint(
                name: "chk_attempt_language",
                table: "exercise_attempts");

            migrationBuilder.AddCheckConstraint(
                name: "chk_active_language",
                table: "users",
                sql: "active_language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')");

            migrationBuilder.AddCheckConstraint(
                name: "chk_lesson_language",
                table: "lesson_progress",
                sql: "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')");

            migrationBuilder.AddCheckConstraint(
                name: "chk_progress_language",
                table: "language_progress",
                sql: "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')");

            migrationBuilder.AddCheckConstraint(
                name: "chk_attempt_language",
                table: "exercise_attempts",
                sql: "language IN ('python','javascript','typescript','csharp','go','rust','java','cpp')");
            // Add routes and recalculate totals without changing XP or existing completions.
            migrationBuilder.Sql("""

INSERT INTO language_progress (id, user_id, language, completed_lessons, total_lessons, xp, current_lesson, completion_percentage, updated_at)
SELECT md5(u.id::text || ':route:' || l.language)::uuid, u.id, l.language, 0, 10, 0, 1, 0, NOW()
FROM users u CROSS JOIN (VALUES ('python'),('javascript'),('typescript'),('csharp'),('go'),('rust'),('java'),('cpp')) l(language)
ON CONFLICT (user_id, language) DO NOTHING;
INSERT INTO lesson_progress (id, user_id, language, lesson_id, is_completed, xp_awarded)
SELECT md5(p.user_id::text || ':' || p.language || ':' || l.lesson_id)::uuid, p.user_id, p.language, l.lesson_id, false, 0
FROM language_progress p CROSS JOIN (VALUES ('hello'),('variables'),('conditions'),('functions'),('loops'),('arrays'),('oop'),('async'),('errors'),('generics')) l(lesson_id)
ON CONFLICT (user_id, language, lesson_id) DO NOTHING;
UPDATE language_progress p SET
 total_lessons = 10,
 completed_lessons = (SELECT count(*) FROM lesson_progress lp WHERE lp.user_id=p.user_id AND lp.language=p.language AND lp.is_completed),
 completion_percentage = (SELECT count(*) * 10.0 FROM lesson_progress lp WHERE lp.user_id=p.user_id AND lp.language=p.language AND lp.is_completed),
 current_lesson = COALESCE((SELECT min(l.ordinal) FROM (VALUES ('hello',1),('variables',2),('conditions',3),('functions',4),('loops',5),('arrays',6),('oop',7),('async',8),('errors',9),('generics',10)) l(id,ordinal)
 WHERE NOT EXISTS (SELECT 1 FROM lesson_progress lp WHERE lp.user_id=p.user_id AND lp.language=p.language AND lp.lesson_id=l.id AND lp.is_completed)),10),
 updated_at = NOW();
""");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            throw new NotSupportedException("This data expansion cannot be safely reversed. Restore a pre-migration backup instead of deleting earned progress.");
        }
    }
}
