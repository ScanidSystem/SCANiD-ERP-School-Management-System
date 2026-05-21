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
    /// Decoupled AuditLogService realization calling stored procedures.
    /// Provides better performance and decoupled architecture.
    /// </summary>
    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync(int limit = 100)
        {
            // Execute high-performance sp_GetAuditLogs Stored Procedure and materialize safely in-memory
            var logs = await _context.AuditLogs
                .IgnoreQueryFilters()
                .FromSqlRaw("EXEC dbo.sp_GetAuditLogs")
                .AsNoTracking()
                .ToListAsync();
            return logs.Take(limit);
        }

        public async Task<bool> InsertAuditLogAsync(AuditLog log)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_InsertAuditLog {log.UserId}, {log.Type}, {log.TableName}, {log.OldValues}, {log.NewValues}, {log.AffectedColumns}, {log.PrimaryKey}"
            );
            return rowsAffected > 0;
        }
    }
}
