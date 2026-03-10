using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AlphaVault.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ApplicationDbContext _context;

        public SettingsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Settings> GetSettingsAsync()
        {
            return await _context.Settings.FirstOrDefaultAsync() ?? new Settings();
        }

        public async Task UpdateSettingsAsync(Settings settings)
        {
            var existingSettings = await _context.Settings.FirstOrDefaultAsync();
            if (existingSettings == null)
            {
                _context.Settings.Add(settings);
            }
            else
            {
                existingSettings.RecycleBinEnabled = settings.RecycleBinEnabled;
                existingSettings.RecycleBinAutoPurgeDays = settings.RecycleBinAutoPurgeDays;
                existingSettings.SiteName = settings.SiteName;
                existingSettings.LogoUrl = settings.LogoUrl;
                existingSettings.ContactEmail = settings.ContactEmail;
            }
            await _context.SaveChangesAsync();
        }
    }
}