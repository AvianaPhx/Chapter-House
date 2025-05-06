using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chapter_House.Migrations
{
    /// <inheritdoc />
    public partial class Chnage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Banners");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Banners",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
