using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uahana.Migrations
{
    public partial class TablesNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Rubros",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Tipo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rubros", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    email = table.Column<string>(type: "varchar(40)", maxLength: 40, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    usuarioId = table.Column<long>(type: "bigint", nullable: false),
                    nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    apellido = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dni = table.Column<long>(type: "bigint", nullable: false),
                    fechaNacimiento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    fechaCreado = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    tipoUsuario = table.Column<int>(type: "int", nullable: false),
                    estado = table.Column<int>(type: "int", nullable: false),
                    susImagenes = table.Column<int>(type: "int", nullable: false),
                    susExposicion = table.Column<int>(type: "int", nullable: false),
                    requiereClave = table.Column<string>(type: "varchar(1)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    passwordHash = table.Column<byte[]>(type: "longblob", nullable: false),
                    passwordSalt = table.Column<byte[]>(type: "longblob", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.email);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Rubros",
                columns: new[] { "Id", "Tipo" },
                values: new object[] { 1L, "Comida" });

            migrationBuilder.InsertData(
                table: "Rubros",
                columns: new[] { "Id", "Tipo" },
                values: new object[] { 2L, "Hogar" });

            migrationBuilder.InsertData(
                table: "Rubros",
                columns: new[] { "Id", "Tipo" },
                values: new object[] { 3L, "Educaciòn" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rubros");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
