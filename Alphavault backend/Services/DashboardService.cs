using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlphaVault.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetStatsAsync()
        {
            var stats = new
            {
                TotalAssets = await _context.Assets.CountAsync(),
                AvailableAssets = await _context.Assets.CountAsync(a => a.Status == AssetStatus.Available),
                UnassignedAssets = await _context.Assets.CountAsync(a => a.Status == AssetStatus.Available && a.AssigneeId == null)
            };
            return stats;
        }

        public async Task<IEnumerable<object>> GetRecentActivityAsync()
        {
            // This is a placeholder. A more robust implementation would involve a dedicated audit log.
            var assets = await _context.Assets.OrderByDescending(a => a.PurchaseDate).Take(5).Select(a => new { Activity = $"New asset '{a.Name}' added", Timestamp = a.PurchaseDate }).ToListAsync();
            return assets;
        }
    }
}