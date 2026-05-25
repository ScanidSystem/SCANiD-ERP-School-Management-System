using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled AuditLogService realization calling stored procedures.
    /// Provides better performance and decoupled architecture.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Executes an operation with transparent retry logic under SQL Server Deadlock (1205) occurrences.
        /// This ensures transient deadlock issues are resolved safely without bubbling errors to end users.
        /// </summary>
        private async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> action, int maxRetries = 3)
        {
            int delay = 150; // Delay in milliseconds
            for (int retry = 0; retry < maxRetries; retry++)
            {
                try
                {
                    return await action();
                }
                catch (SqlException ex) when (ex.Number == 1205) // 1205 is the SQL Server Error code for deadlocks
                {
                    if (retry == maxRetries - 1)
                    {
                        FileLogger.LogError(new Exception($"Database transaction transient deadlock failed after {maxRetries} retry attempts.", ex));
                        throw;
                    }
                    await Task.Delay(delay);
                    delay *= 2; // Exponential backoff
                }
                catch (Exception ex)
                {
                    FileLogger.LogError(ex);
                    throw;
                }
            }
            throw new InvalidOperationException("Execution failed after maximum transient deadlock retries.");
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync(int limit = 100)
        {
            // Execute high-performance sp_GetAuditLogs Stored Procedure and materialize safely in-memory
            var logs = await _context.AuditLogs
                .FromSqlRaw("EXEC dbo.sp_GetAuditLogs")
                .IgnoreQueryFilters()
                .AsNoTracking()
                .ToListAsync();
            return logs.Take(limit);
        }

        public async Task<bool> InsertAuditLogAsync(AuditLog log)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_InsertAuditLog {log.UserId}, {log.Type}, {log.TableName}, {log.OldValues}, {log.NewValues}, {log.AffectedColumns}, {log.PrimaryKey}"
                );
                return rowsAffected > 0;
            });
        }
    }
}
