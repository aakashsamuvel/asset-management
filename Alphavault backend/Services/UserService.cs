using AlphaVault.Data;
using AlphaVault.DTOs;
using AlphaVault.Interfaces;
using AlphaVault.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace AlphaVault.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly GraphServiceClient _graphServiceClient;
        private readonly IConfiguration _configuration;

        private readonly IHttpClientFactory _httpClientFactory;

        public UserService(ApplicationDbContext context, GraphServiceClient graphServiceClient, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _graphServiceClient = graphServiceClient;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IEnumerable<AlphaVault.Models.User>> GetUsersAsync()
        {
            return await _context.Users
                .Select(u => new User
                {
                    Id = u.Id,
                    FullName = u.FullName ?? string.Empty,
                    Email = u.Email ?? string.Empty,
                    Role = u.Role ?? string.Empty,
                    Permissions = u.Permissions ?? string.Empty
                })
                .ToListAsync();
        }

        public async Task<AlphaVault.Models.User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task AddUserAsync(AlphaVault.Models.User user)
        {
            // Check if the user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null)
            {
                // Add the user if they don't exist
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateUserAsync(int id, AlphaVault.Models.User updatedUser)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser != null)
            {
                existingUser.Role = updatedUser.Role;
                existingUser.Permissions = updatedUser.Permissions;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        // public async Task<IEnumerable<GraphUserDto>> GetAzureAdUsersAsync()
        // {
        //     return await Task.FromResult(new List<GraphUserDto>());
        // }

        public async Task<List<GraphUserDto>> GetAzureAdUsersAsync()
{
    var tenantId = _configuration["AzureAd:TenantId"];
    var clientId = _configuration["AzureAd:ClientId"];
    var clientSecret = _configuration["AzureAd:ClientSecret"];

    if (string.IsNullOrEmpty(tenantId))
        throw new InvalidOperationException("AzureAd:TenantId is not configured.");
    if (string.IsNullOrEmpty(clientId))
        throw new InvalidOperationException("AzureAd:ClientId is not configured.");
    if (string.IsNullOrEmpty(clientSecret))
        throw new InvalidOperationException("AzureAd:ClientSecret is not configured.");

    // Get token
    var tokenClient = _httpClientFactory.CreateClient();
    var tokenRequest = new HttpRequestMessage(HttpMethod.Post, $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token")
    {
        Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "client_id", clientId },
            { "scope", "https://graph.microsoft.com/.default" },
            { "client_secret", clientSecret },
            { "grant_type", "client_credentials" }
        })
    };

    var tokenResponse = await tokenClient.SendAsync(tokenRequest);
    var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
    if (!tokenResponse.IsSuccessStatusCode)
        throw new Exception("Failed to get Graph token: " + tokenJson);

    var accessToken = JsonDocument.Parse(tokenJson).RootElement.GetProperty("access_token").GetString();

    // Setup Graph Client
    var graphClient = _httpClientFactory.CreateClient();
    graphClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

    // Paging
    var users = new List<GraphUserDto>();
    var url = "https://graph.microsoft.com/v1.0/users?$filter=accountEnabled eq true&$select=id,displayName,mail,userPrincipalName,givenName,surname,jobTitle,mobilePhone";

    while (!string.IsNullOrEmpty(url))
    {
        var response = await graphClient.GetAsync(url);
        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception("Graph call failed: " + json);

        var doc = JsonDocument.Parse(json);
        var values = doc.RootElement.GetProperty("value");

        foreach (var user in values.EnumerateArray())
        {
            users.Add(new GraphUserDto
            {
                Id = user.GetProperty("id").GetString(),
                DisplayName = user.GetProperty("displayName").GetString(),
                Mail = user.TryGetProperty("mail", out var mailProp) ? mailProp.GetString() : null,
                UserPrincipalName = user.GetProperty("userPrincipalName").GetString(),
                GivenName = user.TryGetProperty("givenName", out var gn) ? gn.GetString() : null,
                Surname = user.TryGetProperty("surname", out var sn) ? sn.GetString() : null,
                JobTitle = user.TryGetProperty("jobTitle", out var jt) ? jt.GetString() : null,
                MobilePhone = user.TryGetProperty("mobilePhone", out var mp) ? mp.GetString() : null
            });
        }

        // Check if there's a next page
        url = doc.RootElement.TryGetProperty("@odata.nextLink", out var nextLink)
            ? nextLink.GetString()
            : null;
    }

    return users;
}

        public async Task<User?> GetUserByFullNameAsync(string fullName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.FullName == fullName);
        }
    }
}