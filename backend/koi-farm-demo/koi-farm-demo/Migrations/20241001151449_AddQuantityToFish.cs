using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace koi_farm_demo.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantityToFish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Fish",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Fish");
        }
    }
}
