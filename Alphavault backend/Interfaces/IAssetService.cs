using AlphaVault.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IAssetService
    {
        Task<IEnumerable<Asset>> GetAssetsAsync(string? filter, string? sortBy, string? sortOrder, int page, int pageSize);
        Task<Asset?> GetAssetByIdAsync(int id);
        Task AddAssetAsync(Asset asset);
        Task UpdateAssetAsync(int id, Asset asset);
        Task SoftDeleteAsync(int id, string deletedBy);
        Task RestoreAsync(int id);
        Task PermanentDeleteAsync(int id);
        Task<List<Asset>> GetTrashedAsync();
        Task PermanentDeleteAllAsync();
        Task RestoreAllAsync();
        Task TransferAssetAsync(int id, int newAssigneeId);
        Task RetireAssetAsync(int id);
        Task ImportAssetsAsync(IEnumerable<Asset> assets);
        Task<byte[]> ExportAssetsAsync(string format);
    }
}