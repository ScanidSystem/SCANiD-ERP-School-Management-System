using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Audit Trial operations.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface IAuditLogService
    {
        Task<IEnumerable<AuditLog>> GetAuditLogsAsync(int limit = 100);
        Task<bool> InsertAuditLogAsync(AuditLog log);
    }
}
