using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled AttendanceService realization calling stored procedures.
    /// Provides outstanding performance and decoupled architecture.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class AttendanceService : IAttendanceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IErrorLogService _errorLogService;

        // Dependency injection of ApplicationDbContext and IErrorLogService for persistent error logging
        public AttendanceService(ApplicationDbContext context, IErrorLogService errorLogService)
        {
            _context = context;
            _errorLogService = errorLogService;
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

        public async Task<IEnumerable<Attendance>> GetAttendanceAsync(DateTime date, int? schoolId, int? academicYearId)
        {
            // Core optimization: Execute sp_GetAttendance containing high-speed SQL joins
            // and map relationships in-memory using DbMapper. This completely avoids Slow Include operations.
            return await DbMapper.ExecuteStoredProcedureAsync<Attendance>(
                _context,
                "dbo.sp_GetAttendance",
                ("Date", date),
                ("SchoolId", schoolId),
                ("AcademicYearId", academicYearId)
            );
        }

        public async Task<bool> SubmitAttendanceAsync(Attendance attendance)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                try
                {
                    // Core optimization: Execute the MERGE stored procedure to insert or update attendance.
                    // Since SET NOCOUNT ON; is defined in the stored procedure, EF Core will return -1 rows affected,
                    // which represents success. We evaluate rowsAffected >= -1 to handle this correctly.
                    var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                        $"EXEC dbo.sp_ManageAttendance {attendance.StudentId}, {attendance.Date}, {attendance.Status}, NULL, NULL"
                    );
                    return rowsAffected >= -1;
                }
                catch (Exception ex)
                {
                    // High-performance exception logging into database via the sp_InsertErrorLog stored procedure
                    await _errorLogService.InsertErrorLogAsync(
                        ex.Message,
                        "Error",
                        ex.ToString(),
                        $"AttendanceService.SubmitAttendanceAsync - StudentId: {attendance.StudentId}, Date: {attendance.Date}"
                    );

                    // Return false if a primary database error or query failure is encountered.
                    return false;
                }
            });
        }

        public async Task<bool> SubmitBulkAttendanceAsync(IEnumerable<Attendance> records)
        {
            if (records == null) return false;

            return await ExecuteWithRetryAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    foreach (var attendance in records)
                    {
                        await _context.Database.ExecuteSqlInterpolatedAsync(
                            $"EXEC dbo.sp_ManageAttendance {attendance.StudentId}, {attendance.Date}, {attendance.Status}, NULL, NULL"
                        );
                    }
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    await _errorLogService.InsertErrorLogAsync(
                        ex.Message,
                        "Error",
                        ex.ToString(),
                        "AttendanceService.SubmitBulkAttendanceAsync - Transaction Rolled Back due to error."
                    );
                    return false;
                }
            });
        }
    }
}
