using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Service implementation for managing system error logs using High-Performance Stored Procedures.
    /// Decouples model querying from ASP.NET Core controllers.
    /// </summary>
    public class ErrorLogService : IErrorLogService
    {
        private readonly ApplicationDbContext _context;

        public ErrorLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the error logs using sp_GetErrorLogs stored procedure.
        /// </summary>
        public async Task<IEnumerable<ErrorLog>> GetErrorLogsAsync(int limit = 100)
        {
            // Execute high-performance sp_GetErrorLogs Stored Procedure and materialize safely in-memory
            var logs = await _context.ErrorLogs
                .FromSqlRaw("EXEC dbo.sp_GetErrorLogs")
                .AsNoTracking()
                .ToListAsync();
            return logs.Take(limit);
        }

        /// <summary>
        /// Logs an error with system properties via sp_InsertErrorLog.
        /// </summary>
        public async Task<bool> InsertErrorLogAsync(string message, string level, string exception, string properties)
        {
            // Call the high-performance sp_InsertErrorLog Stored Procedure
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_InsertErrorLog {message}, {level}, {exception}, {properties}"
            );
            return rowsAffected > 0;
        }

        /// <summary>
        /// Empties system logs in a fast bulk execution.
        /// </summary>
        public async Task<bool> ClearErrorLogsAsync()
        {
            var rowsAffected = await _context.Database.ExecuteSqlRawAsync("DELETE FROM [dbo].[ErrorLogs]");
            return rowsAffected > 0;
        }
    }
}
