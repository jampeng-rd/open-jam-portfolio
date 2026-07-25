using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PortfolioProjectTechnology",
                columns: table => new
                {
                    PortfolioProjectsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TechnologiesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioProjectTechnology", x => new { x.PortfolioProjectsId, x.TechnologiesId });
                    table.ForeignKey(
                        name: "FK_PortfolioProjectTechnology_Portfolios_PortfolioProjectsId",
                        column: x => x.PortfolioProjectsId,
                        principalTable: "Portfolios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PortfolioProjectTechnology_Technologys_TechnologiesId",
                        column: x => x.TechnologiesId,
                        principalTable: "Technologys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioProjectTechnology_TechnologiesId",
                table: "PortfolioProjectTechnology",
                column: "TechnologiesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortfolioProjectTechnology");
        }
    }
}
