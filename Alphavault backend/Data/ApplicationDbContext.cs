using Microsoft.EntityFrameworkCore;
using AlphaVault.Models;

namespace AlphaVault.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Asset> Assets { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Procurement> Procurements { get; set; }
        public DbSet<Settings> Settings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Asset>(entity =>
            {
                entity.Property(a => a.PurchasePrice)
                    .HasPrecision(18, 2);

                // Configure nullable properties
                entity.Property(a => a.Description).IsRequired(false);
                entity.Property(a => a.Processor).IsRequired(false);
                entity.Property(a => a.Ram).IsRequired(false);
                entity.Property(a => a.Storage).IsRequired(false);
                entity.Property(a => a.ScreenSize).IsRequired(false);
                entity.Property(a => a.Resolution).IsRequired(false);
                entity.Property(a => a.PanelType).IsRequired(false);
                entity.Property(a => a.RefreshRate).IsRequired(false);
                entity.Property(a => a.ConnectionType).IsRequired(false);
                entity.Property(a => a.BatteryLife).IsRequired(false);
                entity.Property(a => a.WarrantyProvider).IsRequired(false);
                entity.Property(a => a.WarrantyStartDate).IsRequired(false);
                entity.Property(a => a.WarrantyEndDate).IsRequired(false);
                entity.Property(a => a.AssetGivenDate).IsRequired(false);
                entity.Property(a => a.OrderNumber).IsRequired(false);
                entity.Property(a => a.AssigneeId).IsRequired(false);
                entity.Property(a => a.PreviousOwnerId).IsRequired(false);
                
                // Global query filter to exclude soft-deleted assets
                entity.HasQueryFilter(a => !a.IsDeleted);
            });
        }
    }
}