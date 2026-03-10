using AlphaVault.Models;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface ISettingsService
    {
        Task<Settings> GetSettingsAsync();
        Task UpdateSettingsAsync(Settings settings);
    }
}