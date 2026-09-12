using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Codelingo.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandOnboardingLocales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "chk_preferences_locale",
                table: "user_preferences");

            migrationBuilder.AddCheckConstraint(
                name: "chk_preferences_locale",
                table: "user_preferences",
                sql: "ui_language IN ('es','en','fr','de','ja','it','pt','zh','ko','ru','ar')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "chk_preferences_locale",
                table: "user_preferences");

            migrationBuilder.AddCheckConstraint(
                name: "chk_preferences_locale",
                table: "user_preferences",
                sql: "ui_language IN ('es','en')");
        }
    }
}
