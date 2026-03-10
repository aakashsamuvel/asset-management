using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetStatsAsync();
        Task<IEnumerable<object>> GetRecentActivityAsync();
    }
}