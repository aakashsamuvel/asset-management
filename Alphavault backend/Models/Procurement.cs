namespace AlphaVault.Models
{
    public class Procurement
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Requester { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime RequestedDate { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string Stage { get; set; } = "Request";
        public string Status { get; set; } = string.Empty;
        public string? RejectionReason { get; set; }
        public int? QuotationId { get; set; }
        public decimal? QuotationAmount { get; set; }
        public string? QuotationVendor { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? ReceiveDate { get; set; }
        public string? ReceivedBy { get; set; }
    }
}