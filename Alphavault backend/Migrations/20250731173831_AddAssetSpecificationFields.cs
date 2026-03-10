using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlphaVault.Migrations
{
    /// <inheritdoc />
    public partial class AddAssetSpecificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BatteryLife",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConnectionType",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PanelType",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Processor",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ram",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RefreshRate",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resolution",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScreenSize",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Storage",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BatteryLife",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "ConnectionType",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "PanelType",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Processor",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Ram",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "RefreshRate",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Resolution",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "ScreenSize",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Storage",
                table: "Assets");
        }
    }
}
