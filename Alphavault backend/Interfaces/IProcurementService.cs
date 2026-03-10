using AlphaVault.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IProcurementService
    {
        Task<IEnumerable<Procurement>> GetProcurementsAsync();
        Task<Procurement?> GetProcurementByIdAsync(int id);
        Task ApproveRequestAsync(int id);
        Task RejectRequestAsync(int id, string reason);
        Task AddQuotationAsync(int id, string quotationId, decimal quotationAmount, string quotationVendor);
        Task CreatePurchaseOrderAsync(int id, string purchaseOrderNumber, DateTime purchaseDate);
        Task ReceiveItemsAsync(int id, DateTime receiveDate, string receivedBy);
    }
}