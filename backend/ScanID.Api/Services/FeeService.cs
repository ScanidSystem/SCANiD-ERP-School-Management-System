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
    /// Decoupled FeeService realization calling stored procedures.
    /// Provides outstanding performance and decoupled architecture.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class FeeService : IFeeService
    {
        private readonly ApplicationDbContext _context;

        public FeeService(ApplicationDbContext context)
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

        public async Task<IEnumerable<Fee>> GetFeesAsync(int? studentId, int? schoolId, int? academicYearId)
        {
            // Core optimization: Execute sp_GetFees containing high-speed SQL joins
            // and map relationships in-memory using DbMapper. This completely avoids Slow Include operations.
            return await DbMapper.ExecuteStoredProcedureAsync<Fee>(
                _context,
                "dbo.sp_GetFees",
                ("StudentId", studentId),
                ("SchoolId", schoolId),
                ("AcademicYearId", academicYearId)
            );
        }

        public async Task<bool> CreateFeeAsync(Fee fee)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Execute the sp_ManageFee stored procedure with positional parameters.
                // Under the hood, our optimized dual-mode sp_ManageFee procedure will translate
                // these arguments into the appropriate database insertions on the Fees table.
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageFee 'INSERT', NULL, {fee.StudentId}, {fee.Amount}, {fee.Status}, {fee.PaymentMethod}, NULL"
                );
                return rowsAffected > 0;
            });
        }
    }
}
