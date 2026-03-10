using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlphaVault.Migrations
{
    /// <inheritdoc />
    public partial class RemovePreviousOwnerIdFromAsset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemId",
                table: "Procurements");

            migrationBuilder.RenameColumn(
                name: "RequestedBy",
                table: "Procurements",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "ItemType",
                table: "Procurements",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ApprovedDate",
                table: "Procurements",
                newName: "ReceiveDate");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "Procurements",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovalDate",
                table: "Procurements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "PurchaseDate",
                table: "Procurements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PurchaseOrderNumber",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "QuotationAmount",
                table: "Procurements",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuotationId",
                table: "Procurements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuotationVendor",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceivedBy",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Requester",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Stage",
                table: "Procurements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Assets",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "ApprovalDate",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "PurchaseDate",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "PurchaseOrderNumber",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "QuotationAmount",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "QuotationId",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "QuotationVendor",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "ReceivedBy",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "Requester",
                table: "Procurements");

            migrationBuilder.DropColumn(
                name: "Stage",
                table: "Procurements");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Procurements",
                newName: "RequestedBy");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Procurements",
                newName: "ItemType");

            migrationBuilder.RenameColumn(
                name: "ReceiveDate",
                table: "Procurements",
                newName: "ApprovedDate");

            migrationBuilder.AddColumn<int>(
                name: "ItemId",
                table: "Procurements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Assets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
