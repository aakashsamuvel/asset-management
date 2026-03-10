using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using System.IO;
using System.Text;

namespace AlphaVault.Services
{
    public class AssetService : IAssetService
    {
        private readonly ApplicationDbContext _context;

        public AssetService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Asset>> GetAssetsAsync(string? filter, string? sortBy, string? sortOrder, int page = 1, int pageSize = 0)
        {
            var query = _context.Assets.Include(a => a.Assignee).Include(a => a.PreviousOwner).AsQueryable();

            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(a => (a.Name != null && a.Name.Contains(filter, StringComparison.OrdinalIgnoreCase)) ||
                                         (a.Type != null && a.Type.Contains(filter, StringComparison.OrdinalIgnoreCase)) ||
                                         (a.Location != null && a.Location.Contains(filter, StringComparison.OrdinalIgnoreCase)));
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                        query = sortOrder?.ToLower() == "asc" ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name);
                        break;
                    case "type":
                        query = sortOrder?.ToLower() == "asc" ? query.OrderBy(a => a.Type) : query.OrderByDescending(a => a.Type);
                        break;
                    case "purchasedate":
                        query = sortOrder?.ToLower() == "asc" ? query.OrderBy(a => a.PurchaseDate) : query.OrderByDescending(a => a.PurchaseDate);
                        break;
                    case "purchaseprice":
                        query = sortOrder?.ToLower() == "asc" ? query.OrderBy(a => a.PurchasePrice) : query.OrderByDescending(a => a.PurchasePrice);
                        break;
                    case "status":
                        query = sortOrder?.ToLower() == "asc" ? query.OrderBy(a => a.Status) : query.OrderByDescending(a => a.Status);
                        break;
                    default:
                        query = query.OrderBy(a => a.Id); // Default sort
                        break;
                }
            }
            else
            {
                query = query.OrderBy(a => a.Id); // Default sort if no sortBy is provided
            }

            if (pageSize > 0)
            {
                query = query.Skip((page - 1) * pageSize).Take(pageSize);
            }
            
            var assets = await query.ToListAsync();


            return assets;
        }

        public async Task<Asset?> GetAssetByIdAsync(int id)
        {
            return await _context.Assets.Include(a => a.Assignee).Include(a => a.PreviousOwner).FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task AddAssetAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAssetAsync(int id, Asset updatedAsset)
        {
            var existingAsset = await _context.Assets.FindAsync(id);
            if (existingAsset != null)
            {
                existingAsset.Name = updatedAsset.Name ?? existingAsset.Name;
                existingAsset.Type = updatedAsset.Type ?? existingAsset.Type;
                existingAsset.Location = updatedAsset.Location ?? existingAsset.Location;
                existingAsset.PurchaseDate = updatedAsset.PurchaseDate ?? existingAsset.PurchaseDate;
                existingAsset.PurchasePrice = updatedAsset.PurchasePrice ?? existingAsset.PurchasePrice;
                existingAsset.Status = updatedAsset.Status ?? existingAsset.Status;
                existingAsset.Model = updatedAsset.Model ?? existingAsset.Model;
                existingAsset.SerialNumber = updatedAsset.SerialNumber ?? existingAsset.SerialNumber;
                existingAsset.Vendor = updatedAsset.Vendor ?? existingAsset.Vendor;
                existingAsset.WarrantyStartDate = updatedAsset.WarrantyStartDate ?? existingAsset.WarrantyStartDate;
                existingAsset.WarrantyEndDate = updatedAsset.WarrantyEndDate ?? existingAsset.WarrantyEndDate;
                existingAsset.WarrantyProvider = updatedAsset.WarrantyProvider ?? existingAsset.WarrantyProvider;
                existingAsset.Description = updatedAsset.Description ?? existingAsset.Description;
                existingAsset.Processor = updatedAsset.Processor ?? existingAsset.Processor;
                existingAsset.Ram = updatedAsset.Ram ?? existingAsset.Ram;
                existingAsset.Storage = updatedAsset.Storage ?? existingAsset.Storage;
                existingAsset.ScreenSize = updatedAsset.ScreenSize ?? existingAsset.ScreenSize;
                existingAsset.Resolution = updatedAsset.Resolution ?? existingAsset.Resolution;
                existingAsset.PanelType = updatedAsset.PanelType ?? existingAsset.PanelType;
                existingAsset.RefreshRate = updatedAsset.RefreshRate ?? existingAsset.RefreshRate;
                existingAsset.ConnectionType = updatedAsset.ConnectionType ?? existingAsset.ConnectionType;
                existingAsset.BatteryLife = updatedAsset.BatteryLife ?? existingAsset.BatteryLife;
                existingAsset.AssigneeId = updatedAsset.AssigneeId ?? existingAsset.AssigneeId;
                existingAsset.PreviousOwnerId = updatedAsset.PreviousOwnerId ?? existingAsset.PreviousOwnerId;
                existingAsset.PreviousOwner = updatedAsset.PreviousOwner ?? existingAsset.PreviousOwner;
                existingAsset.AssetGivenDate = updatedAsset.AssetGivenDate ?? existingAsset.AssetGivenDate;
                existingAsset.OrderNumber = updatedAsset.OrderNumber ?? existingAsset.OrderNumber;

                await _context.SaveChangesAsync();
            }
        }

        public async Task SoftDeleteAsync(int id, string deletedBy)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) throw new KeyNotFoundException("Asset not found");
            asset.IsDeleted = true;
            asset.DeletedAt = DateTime.UtcNow;
            asset.DeletedBy = deletedBy;
            await _context.SaveChangesAsync();
        }

        public async Task RestoreAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) throw new KeyNotFoundException("Asset not found");
            asset.IsDeleted = false;
            asset.DeletedAt = null;
            asset.DeletedBy = null;
            await _context.SaveChangesAsync();
        }

        public async Task PermanentDeleteAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Asset>> GetTrashedAsync()
        {
            return await _context.Assets
                .Where(a => a.IsDeleted)
                .OrderByDescending(a => a.DeletedAt)
                .ToListAsync();
        }

        public async Task PermanentDeleteAllAsync()
        {
            var trashed = _context.Assets.Where(a => a.IsDeleted);
            _context.Assets.RemoveRange(trashed);
            await _context.SaveChangesAsync();
        }

        public async Task RestoreAllAsync()
        {
            var trashed = await _context.Assets.Where(a => a.IsDeleted).ToListAsync();
            trashed.ForEach(a => {
                a.IsDeleted = false;
                a.DeletedAt = null;
                a.DeletedBy = null;
            });
            await _context.SaveChangesAsync();
        }

        public async Task TransferAssetAsync(int id, int newAssigneeId)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                asset.AssigneeId = newAssigneeId;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RetireAssetAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset != null)
            {
                asset.Status = AssetStatus.Retired;
                await _context.SaveChangesAsync();
            }
        }

        public async Task ImportAssetsAsync(IEnumerable<Asset> assets)
        {
            _context.Assets.AddRange(assets);
            await _context.SaveChangesAsync();
        }

        public async Task<byte[]> ExportAssetsAsync(string format)
        {
            var assets = await _context.Assets.Include(a => a.Assignee).Include(a => a.PreviousOwner).ToListAsync();

            if (format.ToLower() == "excel")
            {
                // Generate Excel file
                var wb = new XLWorkbook();
                var ws = wb.Worksheets.Add("Assets");

                // Add headers
                ws.Cell(1, 1).Value = "Id";
                ws.Cell(1, 2).Value = "Name";
                ws.Cell(1, 3).Value = "Type";
                ws.Cell(1, 4).Value = "Location";
                ws.Cell(1, 5).Value = "PurchaseDate";
                ws.Cell(1, 6).Value = "PurchasePrice";
                ws.Cell(1, 7).Value = "Status";
                ws.Cell(1, 8).Value = "Model";
                ws.Cell(1, 9).Value = "SerialNumber";
                ws.Cell(1, 10).Value = "Vendor";
                ws.Cell(1, 11).Value = "WarrantyStartDate";
                ws.Cell(1, 12).Value = "WarrantyEndDate";
                ws.Cell(1, 13).Value = "WarrantyProvider";
                ws.Cell(1, 14).Value = "Description";
                ws.Cell(1, 15).Value = "Assignee";
                ws.Cell(1, 16).Value = "PreviousOwner";
    
                // Add data
                for (int i = 0; i < assets.Count; i++)
                {
                    var asset = assets[i];
                    ws.Cell(i + 2, 1).Value = asset.Id;
                    ws.Cell(i + 2, 2).Value = asset.Name;
                    ws.Cell(i + 2, 3).Value = asset.Type;
                    ws.Cell(i + 2, 4).Value = asset.Location;
                    ws.Cell(i + 2, 5).Value = asset.PurchaseDate?.ToString("yyyy-MM-dd") ?? "";
                    ws.Cell(i + 2, 6).Value = asset.PurchasePrice;
                    ws.Cell(i + 2, 7).Value = asset.Status.ToString();
                    ws.Cell(i + 2, 8).Value = asset.Model;
                    ws.Cell(i + 2, 9).Value = asset.SerialNumber;
                    ws.Cell(i + 2, 10).Value = asset.Vendor;
                    ws.Cell(i + 2, 11).Value = asset.WarrantyStartDate?.ToString("yyyy-MM-dd") ?? "";
                    ws.Cell(i + 2, 12).Value = asset.WarrantyEndDate?.ToString("yyyy-MM-dd") ?? "";
                    ws.Cell(i + 2, 13).Value = asset.WarrantyProvider;
                    ws.Cell(i + 2, 14).Value = asset.Description;
                    ws.Cell(i + 2, 15).Value = asset.Assignee?.FullName ?? "";
                    ws.Cell(i + 2, 16).Value = asset.PreviousOwner?.FullName ?? "";
                }

                // Convert to byte array
                using (var stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return stream.ToArray();
                }
            }
            else if (format.ToLower() == "csv")
            {
                // Generate CSV file
                var csv = new StringBuilder();

                // Add headers
                csv.AppendLine("Id,Name,Type,Location,PurchaseDate,PurchasePrice,Status,Model,SerialNumber,Vendor,WarrantyStartDate,WarrantyEndDate,WarrantyProvider,Description,Assignee,PreviousOwner");

                // Add data
                foreach (var asset in assets)
                {
                    csv.AppendLine($"{asset.Id},{asset.Name},{asset.Type},{asset.Location},{asset.PurchaseDate},{asset.PurchasePrice},{asset.Status},{asset.Model},{asset.SerialNumber},{asset.Vendor},{asset.WarrantyStartDate},{asset.WarrantyEndDate},{asset.WarrantyProvider},{asset.Description},{asset.Assignee?.FullName},{asset.PreviousOwner?.FullName}");
                }

                return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
            }
            else
            {
                throw new ArgumentException("Invalid export format. Supported formats are 'excel' and 'csv'.");
            }
        }
    }
}