namespace AlphaVault.Models
{
    public enum AssetStatus
    {
        Available,
        Assigned,
        UnderMaintenance,
        Retired,
        ProcurementPending
    }

    public class Asset
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Location { get; set; } = string.Empty;
        public DateTime? PurchaseDate { get; set; }
        public decimal? PurchasePrice { get; set; }
        public AssetStatus? Status { get; set; }
        public string? Model { get; set; } = string.Empty;
        public string? SerialNumber { get; set; } = string.Empty;
        public string? Vendor { get; set; } = string.Empty;
        public DateTime? WarrantyStartDate { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public string? WarrantyProvider { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Processor { get; set; }
        public string? Ram { get; set; }
        public string? Storage { get; set; }
        public string? ScreenSize { get; set; }
        public string? Resolution { get; set; }
        public string? PanelType { get; set; }
        public string? RefreshRate { get; set; }
        public string? ConnectionType { get; set; }
        public string? BatteryLife { get; set; }
        public int? AssigneeId { get; set; }
        public User? Assignee { get; set; }
        public int? PreviousOwnerId { get; set; }
        public User? PreviousOwner { get; set; }
        public DateTime? AssetGivenDate { get; set; }
        public string? OrderNumber { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
    }
}