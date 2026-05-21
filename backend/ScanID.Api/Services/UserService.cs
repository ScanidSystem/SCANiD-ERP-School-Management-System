#pragma warning disable CS8604 // Disable warning for possible null reference argument for parameter 'parameters' in SqlQueryRaw
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled UserService realization calling stored procedures.
    /// Provides better performance and decoupled architecture.
    /// </summary>
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users
                .FromSqlRaw("EXEC dbo.sp_GetUsers")
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            var list = await GetUsersAsync();
            return list.FirstOrDefault(u => u.Id == id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.PasswordHash = string.IsNullOrEmpty(user.PasswordHash) ? "password123" : user.PasswordHash;

            var idResult = await _context.Database.SqlQueryRaw<int>(
                "EXEC dbo.sp_ManageUser @Action='INSERT', @Id=NULL, @Username={0}, @PasswordHash={1}, @Name={2}, @Email={3}, @Role={4}, @RoleId={5}, @SchoolId={6}, @CreatedBy=NULL",
                user.Username, user.PasswordHash, user.Name, user.Email, user.Role, user.RoleId, user.SchoolId
            ).ToListAsync();

            user.Id = idResult.FirstOrDefault();
            return user;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageUser 'UPDATE', {user.Id}, {user.Username}, {user.PasswordHash}, {user.Name}, {user.Email}, {user.Role}, {user.RoleId}, {user.SchoolId}"
            );
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageUser 'DELETE', {id}"
            );
            return rowsAffected > 0;
        }

        public async Task<bool> UpdateUserRoleAsync(int id, string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.Role = role;
            user.ModifiedOn = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
