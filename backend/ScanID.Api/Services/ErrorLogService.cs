using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Service implementation for managing system error logs using High-Performance Stored Procedures.
    /// Decouples model querying from ASP.NET Core controllers.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class ErrorLogService : IErrorLogService
    {
        private readonly ApplicationDbContext _context;

        public ErrorLogService(ApplicationDbContext context)
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

        /// <summary>
        /// Retrieves the error logs using sp_GetErrorLogs stored procedure.
        /// </summary>
        public async Task<IEnumerable<ErrorLog>> GetErrorLogsAsync(int limit = 100)
        {
            // Execute high-performance sp_GetErrorLogs Stored Procedure and materialize safely in-memory
            var logs = await _context.ErrorLogs
                .FromSqlRaw("EXEC dbo.sp_GetErrorLogs")
                .IgnoreQueryFilters()
                .AsNoTracking()
                .ToListAsync();
            return logs.Take(limit);
        }

        /// <summary>
        /// Retrieves error logs using server-side paging and sorting directly in a stored procedure.
        /// </summary>
        public async Task<(IEnumerable<ErrorLog> Data, int TotalCount)> GetErrorLogsPagedAsync(int page, int pageSize, string sortBy, string sortOrder)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var list = new List<ErrorLog>();
                int totalCount = 0;

                var connection = _context.Database.GetDbConnection();
                if (connection.State == ConnectionState.Closed)
                {
                    await _context.Database.OpenConnectionAsync();
                }

                using var command = connection.CreateCommand();
                command.CommandText = "dbo.sp_GetErrorLogsPaged";
                command.CommandType = CommandType.StoredProcedure;

                void AddParam(string name, object? val)
                {
                    var param = command.CreateParameter();
                    param.ParameterName = name.StartsWith("@") ? name : "@" + name;
                    param.Value = val ?? DBNull.Value;
                    command.Parameters.Add(param);
                }

                AddParam("Page", page);
                AddParam("PageSize", pageSize);
                AddParam("SortBy", sortBy);
                AddParam("SortOrder", sortOrder);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var item = new ErrorLog
                    {
                        Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                        Message = reader["Message"] != DBNull.Value ? reader["Message"].ToString() : null,
                        Level = reader["Level"] != DBNull.Value ? reader["Level"].ToString() : null,
                        Timestamp = reader["Timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["Timestamp"]) : DateTime.UtcNow,
                        Exception = reader["Exception"] != DBNull.Value ? reader["Exception"].ToString() : null,
                        Properties = reader["Properties"] != DBNull.Value ? reader["Properties"].ToString() : null
                    };

                    if (reader["TotalCount"] != DBNull.Value)
                    {
                        totalCount = Convert.ToInt32(reader["TotalCount"]);
                    }

                    list.Add(item);
                }

                return ((IEnumerable<ErrorLog>)list, totalCount);
            });
        }

        /// <summary>
        /// Logs an error with system properties via sp_InsertErrorLog.
        /// </summary>
        public async Task<bool> InsertErrorLogAsync(string message, string level, string exception, string properties)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Call the high-performance sp_InsertErrorLog Stored Procedure
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_InsertErrorLog {message}, {level}, {exception}, {properties}"
                );
                return rowsAffected > 0;
            });
        }

        /// <summary>
        /// Empties system logs in a fast bulk execution.
        /// </summary>
        public async Task<bool> ClearErrorLogsAsync()
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlRawAsync("DELETE FROM [dbo].[ErrorLogs]");
                return rowsAffected > 0;
            });
        }
    }
}
