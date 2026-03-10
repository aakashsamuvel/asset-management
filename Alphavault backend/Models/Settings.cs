namespace AlphaVault.Models
{
    public class Settings
    {
        public int Id { get; set; }
        public string? SiteName { get; set; }
        public string? LogoUrl { get; set; }
        public string? ContactEmail { get; set; }
        public bool RecycleBinEnabled { get; set; } = true;
        public int? RecycleBinAutoPurgeDays { get; set; } = 30;
        public bool IsDeleted { get; set; }
public DateTime? DeletedAt { get; set; }
public string? DeletedBy { get; set; }

    }
}