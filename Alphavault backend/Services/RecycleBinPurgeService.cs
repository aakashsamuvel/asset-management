using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using AlphaVault.Data;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using System.Threading.Tasks;

namespace AlphaVault.Services
{
    public class RecycleBinPurgeService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceProvider _services;

        public RecycleBinPurgeService(IServiceProvider services)
        {
            _services = services;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Run daily
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(24));
            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
            using var scope = _services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                var settings = await dbContext.Settings.FirstOrDefaultAsync();
                if (settings?.RecycleBinEnabled != true) return;

                var days = settings.RecycleBinAutoPurgeDays.GetValueOrDefault(30);

                var cutoff = DateTime.UtcNow.AddDays(-days);
                var oldAssets = dbContext.Assets
                    .Where(a => a.IsDeleted && a.DeletedAt <= cutoff);

                dbContext.Assets.RemoveRange(oldAssets);
                await dbContext.SaveChangesAsync();
            }
            catch
            {
                // Log exception here
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}