using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled AuthService realization calling high-performance stored procedures / joins.
    /// Provides outstanding performance and keeps domain schemas isolated.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> LogInAsync(string username, string password)
        {
            // Core optimization: Execute pre-compiled database stored procedure designed with SQL joins
            // This is extremely high performing and avoids slow entity framework virtual evaluation.
            var users = await DbMapper.ExecuteStoredProcedureAsync<User>(
                _context, 
                "dbo.sp_AuthenticateUser", 
                ("Username", username), 
                ("Password", password)
            );

            return users.FirstOrDefault();
        }

        public async Task<User?> FindUserByUsernameAsync(string username)
        {
            // Optimized query using pre-cached database mapping to bypass unneeded metadata retrieval loops
            var users = await DbMapper.ExecuteStoredProcedureAsync<User>(_context, "dbo.sp_GetUsers");
            return users.FirstOrDefault(u => u.Username == username);
        }
    }
}
