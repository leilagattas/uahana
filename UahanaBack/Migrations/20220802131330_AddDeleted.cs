using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uahana.Migrations
{
    public partial class AddDeleted : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "borrado",
                table: "Users",
                type: "varchar(1)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "borrado",
                table: "Users");
        }
    }
}
