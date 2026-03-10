using AlphaVault.Interfaces;
using AlphaVault.DTOs;
using AlphaVault.Models;
using AlphaVault.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AlphaVault.Controllers
{
    [Route("api/assets")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;

        public AssetsController(IAssetService assetService, IUserService userService, ApplicationDbContext context)
        {
            _assetService = assetService;
            _userService = userService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets(
            [FromQuery] string? filter = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 0)
        {
            var assets = await _context.Assets
                .Include(a => a.Assignee)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.Type,
                    a.Location,
                    a.PurchaseDate,
                    a.PurchasePrice,
                    a.Status,
                    a.Model,
                    a.SerialNumber,
                    a.Vendor,
                    a.WarrantyStartDate,
                    a.WarrantyEndDate,
                    a.WarrantyProvider,
                    a.Description,
                    a.AssigneeId,
                    a.PreviousOwnerId,
                    a.AssetGivenDate,
                    a.Processor,
                    a.Ram,
                    a.Storage,
                    a.ScreenSize,
                    a.Resolution,
                    a.PanelType,
                    a.RefreshRate,
                    a.ConnectionType,
                    a.BatteryLife,
                    a.OrderNumber,
                    AssigneeName = a.Assignee != null ? a.Assignee.FullName : null
                })
                .ToListAsync();
            return Ok(assets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAsset(int id)
        {
            var asset = await _assetService.GetAssetByIdAsync(id);

            if (asset == null)
            {
                return NotFound();
            }

            return Ok(asset);
        }

        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset([FromBody] Asset asset)
        {
            await _assetService.AddAssetAsync(asset);
            return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, asset);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsset(int id, [FromBody] Asset asset)
        {
            if (id != asset.Id)
            {
                return BadRequest();
            }

            await _assetService.UpdateAssetAsync(id, asset);
            return Ok(asset);
        }

        [HttpPost("{id}/trash")]
        public async Task<IActionResult> Trash(int id)
        {
            var user = User?.Identity?.Name ?? "system";
            await _assetService.SoftDeleteAsync(id, user);
            return NoContent();
        }

        [HttpPost("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            await _assetService.RestoreAsync(id);
            return NoContent();
        }

        [HttpDelete("{id}/permanent")]
        public async Task<IActionResult> PermanentDelete(int id)
        {
            await _assetService.PermanentDeleteAsync(id);
            return NoContent();
        }

        [HttpGet("recycle")]
        public async Task<IActionResult> GetRecycleBin()
        {
            var list = await _assetService.GetTrashedAsync();
            return Ok(list);
        }

        [HttpPost("recycle/restore-all")]
        public async Task<IActionResult> RestoreAll()
        {
            await _assetService.RestoreAllAsync();
            return NoContent();
        }

        [HttpDelete("recycle/empty")]
        public async Task<IActionResult> EmptyRecycleBin()
        {
            await _assetService.PermanentDeleteAllAsync();
            return NoContent();
        }

        [HttpPost("recycle/restore")]
        public async Task<IActionResult> RestoreSelected([FromBody] int[] ids)
        {
            foreach (var id in ids) await _assetService.RestoreAsync(id);
            return NoContent();
        }

        [HttpDelete("recycle/permanent")]
        public async Task<IActionResult> PermanentlyDeleteSelected([FromBody] int[] ids)
        {
            foreach (var id in ids) await _assetService.PermanentDeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/transfer")]
        public async Task<IActionResult> TransferAsset(int id, [FromBody] TransferRequestDto request)
        {
            await _assetService.TransferAssetAsync(id, request.NewAssigneeId);
            return Ok();
        }

        [HttpPost("{id}/retire")]
        public async Task<IActionResult> RetireAsset(int id)
        {
            await _assetService.RetireAssetAsync(id);
            return Ok();
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportAssets([FromBody] List<Dictionary<string, object>> assets)
        {
            var errors = new List<string>();
            var processedAssets = new List<Asset>();
            var assetProperties = typeof(Asset).GetProperties();
            var requiredFields = new[] { "Name", "Type", "Status" };

            try
            {
                if (assets == null || !assets.Any())
                {
                    return BadRequest(new { Error = "No assets provided for import" });
                }
                if (assets == null || !assets.Any())
                {
                    return BadRequest(new { Error = "No assets provided for import" });
                }
                if (assets == null || !assets.Any())
                {
                    return BadRequest(new { Error = "No assets provided for import" });
                }
                if (assets == null || assets.Count == 0)
                {
                    return BadRequest(new { Error = "No assets provided for import" });
                }
                foreach (var assetData in assets)
            {
                // Validate required fields
                var missingFields = requiredFields
                    .Where(f => !assetData.ContainsKey(f) ||
                               assetData[f] == null ||
                               string.IsNullOrWhiteSpace(assetData[f].ToString()))
                    .ToList();

                if (missingFields.Any())
                {
                    errors.AddRange(missingFields.Select(f =>
                        $"Asset {processedAssets.Count + 1}: Missing required field '{f}'"));
                    continue;
                }

                var asset = new Asset();
                
                foreach (var field in assetData)
                {
                    if (field.Value == null || string.IsNullOrWhiteSpace(field.Value.ToString()))
                    {
                        continue; // Skip empty fields
                    }
                {
                    // Find property case-insensitively
                    var property = assetProperties.FirstOrDefault(p =>
                        p.Name.Equals(field.Key, StringComparison.OrdinalIgnoreCase));
                    
                    if (property != null && property.CanWrite)
                    {
                        try
                        {
                            object value = field.Value;
                            
                            // Handle null values
                            if (value == null || value.ToString() == "")
                            {
                                property.SetValue(asset, null);
                                continue;
                            }

                            // Special handling for user ID fields
                            if ((property.Name == "AssigneeId" || property.Name == "PreviousOwnerId")
                                && value is string stringValue)
                            {
                                if (!int.TryParse(stringValue, out int userId))
                                {
                                    var trimmedName = stringValue.Trim();
                                    var user = await _context.Users
                                        .AsQueryable()
                                        .FirstOrDefaultAsync(u =>
                                            EF.Functions.Like(u.FullName!, $"%{trimmedName}%"));
                                    if (user == null)
                                    {
                                        Console.WriteLine($"User not found: {trimmedName}");
                                        // Optionally set to null or a default user ID
                                        value = null;
                                    }
                                    else
                                    {
                                        value = user.Id;
                                    }
                                }
                            }

                            // Convert value to the correct type
                            if (property.PropertyType == typeof(string))
                            {
                                value = value.ToString().Trim();
                            }
                            else if (property.PropertyType == typeof(DateTime?) || property.PropertyType == typeof(DateTime))
                            {
                                if (value is string dateString)
                                {
                                    var dateFormats = new[]
                                    {
                                        "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd",
                                        "dd-MMM-yyyy", "MMM dd, yyyy", "dd MMM yyyy",
                                        "dd/MM/yyyy HH:mm:ss", "MM/dd/yyyy HH:mm:ss",
                                        "yyyy-MM-dd HH:mm:ss"
                                    };
                                    
                                    if (DateTime.TryParseExact(dateString, dateFormats,
                                        System.Globalization.CultureInfo.InvariantCulture,
                                        System.Globalization.DateTimeStyles.None, out DateTime dateValue))
                                    {
                                        value = dateValue;
                                    }
                                    else
                                    {
                                        Console.WriteLine($"Failed to parse date: {dateString}");
                                        value = null;
                                    }
                                }
                                else if (value is double excelDate)
                                {
                                    // Handle Excel serial date format
                                    value = DateTime.FromOADate(excelDate);
                                }
                                else
                                {
                                    Console.WriteLine($"Unexpected date value type: {value?.GetType().Name}");
                                    value = null;
                                }
                            }
                            else if (property.PropertyType == typeof(decimal) || property.PropertyType == typeof(decimal?))
                            {
                                decimal.TryParse(value.ToString(), out decimal decimalValue);
                                value = decimalValue;
                            }
                            else if (property.PropertyType == typeof(bool) || property.PropertyType == typeof(bool?))
                            {
                                if (value is string boolString)
                                {
                                    value = boolString.ToLower() == "true" || boolString == "1";
                                }
                            }

                            // Set the property value
                            var convertedValue = Convert.ChangeType(value, Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType);
                            property.SetValue(asset, convertedValue);
                        }
                        catch (Exception ex)
                        {
                            var errorMsg = $"Asset {processedAssets.Count + 1}: Error setting '{property.Name}' to '{field.Value}': {ex.Message}";
                            Console.WriteLine(errorMsg);
                            errors.Add(errorMsg);
                        }
                    }
                }
                processedAssets.Add(asset);
            }

                if (processedAssets.Count == 0)
                {
                    errors.Add("No valid assets found to import");
                }

                if (errors.Any())
                {
                    return BadRequest(new { Errors = errors });
                }

                await _assetService.ImportAssetsAsync(processedAssets);
                return Ok(new { ImportedCount = processedAssets.Count });
            
            }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Import failed: {ex}");
                return StatusCode(500, new { Error = "Internal server error during import", Details = ex.Message });
            }
            return BadRequest(new { Error = "Unexpected import failure" });
        }
        

        [HttpGet("export")]
        public async Task<IActionResult> ExportAssets([FromQuery] string format)
        {
            try
            {
                var fileBytes = await _assetService.ExportAssetsAsync(format);
                return File(fileBytes, GetContentType(format), $"assets.{format}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GetContentType(string format)
        {
            switch (format.ToLower())
            {
                case "excel":
                    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                case "csv":
                    return "text/csv";
                default:
                    return "application/octet-stream";
            }
        }
    }
}
