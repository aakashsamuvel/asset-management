using AlphaVault.Models;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string email, string password);
        Task<User> RegisterAsync(User user);
        Task LogoutAsync();
    }
}