using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service interface for system error log tracking and management.
    /// Adheres to SOLID design principles and decoupled business boundaries.
    /// </summary>
    public interface IErrorLogService
    {
        /// <summary>
        /// Retrieves the most recent system error logs using a stored procedure.
        /// </summary>
        Task<IEnumerable<ErrorLog>> GetErrorLogsAsync(int limit = 100);

        /// <summary>
        /// Retrieves the system error logs using server-side pagination and sorting directly in a stored procedure.
        /// </summary>
        Task<(IEnumerable<ErrorLog> Data, int TotalCount)> GetErrorLogsPagedAsync(int page, int pageSize, string sortBy, string sortOrder);

        /// <summary>
        /// Inserts a new error log telemetry event into SQL Server.
        /// </summary>
        Task<bool> InsertErrorLogAsync(string message, string level, string exception, string properties);

        /// <summary>
        /// Resets/clears all recorded error logs.
        /// </summary>
        Task<bool> ClearErrorLogsAsync();
    }
}
