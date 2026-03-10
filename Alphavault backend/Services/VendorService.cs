using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Services
{
    public class VendorService : IVendorService
    {
        private readonly ApplicationDbContext _context;

        public VendorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vendor>> GetVendorsAsync()
        {
            return await _context.Vendors.ToListAsync();
        }

        public async Task<Vendor?> GetVendorByIdAsync(int id)
        {
            return await _context.Vendors.FindAsync(id);
        }

        public async Task AddVendorAsync(Vendor vendor)
        {
            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVendorAsync(int id, Vendor updatedVendor)
        {
            var existingVendor = await _context.Vendors.FindAsync(id);
            if (existingVendor != null)
            {
                existingVendor.Name = updatedVendor.Name;
                existingVendor.ContactPerson = updatedVendor.ContactPerson;
                existingVendor.Email = updatedVendor.Email;
                existingVendor.Phone = updatedVendor.Phone;
                existingVendor.Address = updatedVendor.Address;
                existingVendor.Rating = updatedVendor.Rating;
                existingVendor.Status = updatedVendor.Status;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteVendorAsync(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor != null)
            {
                _context.Vendors.Remove(vendor);
                await _context.SaveChangesAsync();
            }
        }
    }
}