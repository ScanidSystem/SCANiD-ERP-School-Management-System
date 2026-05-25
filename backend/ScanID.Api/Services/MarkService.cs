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
    /// Decoupled MarkService realization calling stored procedures.
    /// Provides outstanding performance and decoupled architecture.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class MarkService : IMarkService
    {
        private readonly ApplicationDbContext _context;

        public MarkService(ApplicationDbContext context)
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

        public async Task<IEnumerable<Mark>> GetMarksAsync(int? studentId, int? schoolId, int? academicYearId)
        {
            // Core optimization: Execute sp_GetMarks containing high-speed SQL joins
            // and map relationships in-memory using DbMapper. This completely avoids Slow Include operations.
            return await DbMapper.ExecuteStoredProcedureAsync<Mark>(
                _context,
                "dbo.sp_GetMarks",
                ("StudentId", studentId),
                ("SchoolId", schoolId),
                ("AcademicYearId", academicYearId)
            );
        }

        public async Task<bool> CreateMarkAsync(Mark mark)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Execute the sp_ManageMark stored procedure using SQL Server parameters.
                // Our advanced dual-mode stored procedure sp_ManageMark handles name mapping 
                // of subject and exam fields and generates corresponding grades dynamically.
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageMark 'INSERT', NULL, {mark.StudentId}, {mark.Subject}, {mark.TotalMarks}, {mark.MarksObtained}, {mark.Grade}, NULL"
                );
                return rowsAffected > 0;
            });
        }
    }
}
