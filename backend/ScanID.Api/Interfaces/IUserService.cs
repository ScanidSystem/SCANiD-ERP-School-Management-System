using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Users Management.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<(IEnumerable<User> Data, int TotalCount)> GetUsersPagedAsync(int page, int pageSize, string? sortBy, string? sortOrder, string? search, int? roleId, int? schoolId);
        Task<User?> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task<bool> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UpdateUserRoleAsync(int id, string role);
    }
}
