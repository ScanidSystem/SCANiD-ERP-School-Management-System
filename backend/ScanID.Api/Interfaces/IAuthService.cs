using ScanID.Api.Models;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Authentication and Password Session operations.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface IAuthService
    {
        Task<User?> LogInAsync(string username, string password);
        Task<User?> FindUserByUsernameAsync(string username);
    }
}
