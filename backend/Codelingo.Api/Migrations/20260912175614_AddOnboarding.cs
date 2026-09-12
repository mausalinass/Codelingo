using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Codelingo.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOnboarding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "placement_results",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    language = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    correct_answers = table.Column<int>(type: "integer", nullable: false),
                    total_questions = table.Column<int>(type: "integer", nullable: false),
                    recommended_lesson_id = table.Column<string>(type: "text", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_placement_results", x => x.id);
                    table.CheckConstraint("chk_placement_language", "language IN ('python','javascript','typescript','csharp')");
                    table.ForeignKey(
                        name: "FK_placement_results_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_preferences",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    ui_language = table.Column<string>(type: "text", nullable: false),
                    programming_language = table.Column<string>(type: "text", nullable: false),
                    experience_level = table.Column<string>(type: "text", nullable: false),
                    onboarding_completed = table.Column<bool>(type: "boolean", nullable: false),
                    starting_lesson_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_preferences", x => x.user_id);
                    table.CheckConstraint("chk_preferences_experience", "experience_level IN ('beginner','basic','intermediate','project_experience')");
                    table.CheckConstraint("chk_preferences_language", "programming_language IN ('python','javascript','typescript','csharp')");
                    table.CheckConstraint("chk_preferences_locale", "ui_language IN ('es','en')");
                    table.ForeignKey(
                        name: "FK_user_preferences_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_placement_results_user_id_completed_at",
                table: "placement_results",
                columns: new[] { "user_id", "completed_at" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "placement_results");

            migrationBuilder.DropTable(
                name: "user_preferences");
        }
    }
}
