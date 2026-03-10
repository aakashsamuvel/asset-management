using AlphaVault.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IVendorService
    {
        Task<IEnumerable<Vendor>> GetVendorsAsync();
        Task<Vendor?> GetVendorByIdAsync(int id);
        Task AddVendorAsync(Vendor vendor);
        Task UpdateVendorAsync(int id, Vendor vendor);
        Task DeleteVendorAsync(int id);
    }
}