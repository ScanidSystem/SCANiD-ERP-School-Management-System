#pragma warning disable CS8604 // Disable warning for possible null reference argument for parameter 'parameters' in SqlQueryRaw
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
    /// Decoupled SchoolService realization invoking stored procedures.
    /// Provides better performance and decoupled architecture.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class SchoolService : ISchoolService
    {
        private readonly ApplicationDbContext _context;

        public SchoolService(ApplicationDbContext context)
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

        public async Task<IEnumerable<School>> GetSchoolsAsync()
        {
            // Execute the sp_GetSchools stored procedure safely using high-performance ADO.NET DbMapper
            // to bypass EF Core's query translation entirely and solve 'FromSql' non-composable query errors.
            return await ScanID.Api.Utilities.DbMapper.ExecuteStoredProcedureAsync<School>(_context, "dbo.sp_GetSchools");
        }

        public async Task<School?> GetSchoolByIdAsync(int id)
        {
            var list = await GetSchoolsAsync();
            return list.FirstOrDefault(s => s.Id == id);
        }

        public async Task<School> CreateSchoolAsync(School school)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Execute the sp_ManageSchool stored procedure safely using high-performance ADO.NET DbMapper 
                // to retrieve the newly generated identity, completely avoiding EF Core query wrapping issues.
                school.Id = await ScanID.Api.Utilities.DbMapper.ExecuteScalarStoredProcedureAsync(
                    _context,
                    "dbo.sp_ManageSchool",
                    ("Action", "INSERT"),
                    ("Id", null),
                    ("Name", school.Name),
                    ("LogoPath", school.ProfilePhotoPath),
                    ("Address", school.Address),
                    ("ContactNumber", school.Phone),
                    ("Email", school.Email),
                    ("CreatedBy", null),
                    ("ShortName", school.ShortName),
                    ("CityId", school.CityId),
                    ("StateId", school.StateId),
                    ("Pincode", school.Pincode),
                    ("SMSLimit", school.SMSLimit),
                    ("TotalSMSSent", school.TotalSMSSent),
                    ("SMSBalance", school.SMSBalance),
                    ("EnableSMS", school.EnableSMS),
                    ("EnablePresenteeSMS", school.EnablePresenteeSMS),
                    ("AutomaticBirthdaySMS", school.AutomaticBirthdaySMS),
                    ("EnableWhatsapp", school.EnableWhatsapp),
                    ("WebsiteUrl", school.WebsiteUrl),
                    ("SMSSenderID", school.SMSSenderID),
                    ("BusNumbers", school.BusNumbers),
                    ("SCANiDContact", school.SCANiDContact),
                    ("SCANiDEmail", school.SCANiDEmail),
                    ("InChargeContact", school.InChargeContact)
                );
                return school;
            });
        }

        public async Task<bool> UpdateSchoolAsync(School school)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                await ScanID.Api.Utilities.DbMapper.ExecuteScalarStoredProcedureAsync(
                    _context,
                    "dbo.sp_ManageSchool",
                    ("Action", "UPDATE"),
                    ("Id", school.Id),
                    ("Name", school.Name),
                    ("LogoPath", school.ProfilePhotoPath),
                    ("Address", school.Address),
                    ("ContactNumber", school.Phone),
                    ("Email", school.Email),
                    ("CreatedBy", null),
                    ("ShortName", school.ShortName),
                    ("CityId", school.CityId),
                    ("StateId", school.StateId),
                    ("Pincode", school.Pincode),
                    ("SMSLimit", school.SMSLimit),
                    ("TotalSMSSent", school.TotalSMSSent),
                    ("SMSBalance", school.SMSBalance),
                    ("EnableSMS", school.EnableSMS),
                    ("EnablePresenteeSMS", school.EnablePresenteeSMS),
                    ("AutomaticBirthdaySMS", school.AutomaticBirthdaySMS),
                    ("EnableWhatsapp", school.EnableWhatsapp),
                    ("WebsiteUrl", school.WebsiteUrl),
                    ("SMSSenderID", school.SMSSenderID),
                    ("BusNumbers", school.BusNumbers),
                    ("SCANiDContact", school.SCANiDContact),
                    ("SCANiDEmail", school.SCANiDEmail),
                    ("InChargeContact", school.InChargeContact)
                );
                return true;
            });
        }

        public async Task<bool> DeleteSchoolAsync(int id)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageSchool 'DELETE', {id}"
                );
                return rowsAffected > 0;
            });
        }

        public async Task<bool> SavePhotoPathAsync(int id, string path)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Core optimization: Update ProfilePhotoPath directly with parameterized SQL execution
                // to completely bypass EF Core ChangeTracker and avoid save-concurrency issues.
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"UPDATE [dbo].[Schools] SET [ProfilePhotoPath] = {path}, [ModifiedOn] = GETUTCDATE() WHERE [Id] = {id}"
                );
                return rowsAffected > 0;
            });
        }
    }
}
