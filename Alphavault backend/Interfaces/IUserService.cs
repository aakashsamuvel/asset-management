using AlphaVault.DTOs;
using AlphaVault.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaVault.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(int id, User user);
        Task DeleteUserAsync(int id);
        Task<User?> GetUserByFullNameAsync(string fullName);
        // Task<IEnumerable<GraphUserDto>> GetAzureAdUsersAsync();

        Task<List<GraphUserDto>> GetAzureAdUsersAsync();
    }
}