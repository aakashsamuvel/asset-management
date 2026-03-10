using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlphaVault.Services
{
    public class ProcurementService : IProcurementService
    {
        private readonly ApplicationDbContext _context;

        public ProcurementService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Procurement>> GetProcurementsAsync()
        {
            return await _context.Procurements.ToListAsync();
        }

        public async Task<Procurement?> GetProcurementByIdAsync(int id)
        {
            return await _context.Procurements.FindAsync(id);
        }

        public async Task ApproveRequestAsync(int id)
        {
            var procurement = await _context.Procurements.FindAsync(id);
            if (procurement == null)
            {
                throw new Exception("Procurement request not found");
            }

            procurement.Stage = "Approval";
            procurement.Status = "Approved";
            procurement.ApprovedBy = "System";
            procurement.ApprovalDate = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async Task RejectRequestAsync(int id, string reason)
        {
            var procurement = await _context.Procurements.FindAsync(id);
            if (procurement == null)
            {
                throw new Exception("Procurement request not found");
            }

            procurement.Stage = "Rejected";
            procurement.Status = "Rejected";
            procurement.RejectionReason = reason;
            procurement.ApprovedBy = "System";
            procurement.ApprovalDate = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async Task AddQuotationAsync(int id, string quotationId, decimal quotationAmount, string quotationVendor)
        {
            var procurement = await _context.Procurements.FindAsync(id);
            if (procurement == null)
            {
                throw new Exception("Procurement request not found");
            }

            procurement.Stage = "Quotation";
            procurement.QuotationId = int.Parse(quotationId);
            procurement.QuotationAmount = quotationAmount;
            procurement.QuotationVendor = quotationVendor;

            await _context.SaveChangesAsync();
        }

        public async Task CreatePurchaseOrderAsync(int id, string purchaseOrderNumber, DateTime purchaseDate)
        {
            var procurement = await _context.Procurements.FindAsync(id);
            if (procurement == null)
            {
                throw new Exception("Procurement request not found");
            }

            procurement.Stage = "Purchase";
            procurement.PurchaseOrderNumber = purchaseOrderNumber;
            procurement.PurchaseDate = purchaseDate;

            await _context.SaveChangesAsync();
        }

        public async Task ReceiveItemsAsync(int id, DateTime receiveDate, string receivedBy)
        {
            var procurement = await _context.Procurements.FindAsync(id);
            if (procurement == null)
            {
                throw new Exception("Procurement request not found");
            }

            procurement.Stage = "Receive";
            procurement.ReceiveDate = receiveDate;
            procurement.ReceivedBy = receivedBy;

            await _context.SaveChangesAsync();
        }
    }
}