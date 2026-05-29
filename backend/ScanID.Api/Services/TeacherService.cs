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
    /// Decoupled TeacherService realization calling high-performance Stored Procedures.
    /// This keeps professional catalog lookups highly optimized and maintains SOLID architectures.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class TeacherService : ITeacherService
    {
        private readonly ApplicationDbContext _context;

        public TeacherService(ApplicationDbContext context)
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

        public async Task<IEnumerable<Teacher>> GetTeachersAsync(int? schoolId)
        {
            // Core optimization: Execute sp_GetTeachers containing SQL joins and handle relation mapping in-memory via DbMapper.
            // This is extremely high performing and scales to huge datasets, completely bypassing Entity Framework .Include() overhead.
            return await DbMapper.ExecuteStoredProcedureAsync<Teacher>(
                _context,
                "dbo.sp_GetTeachers",
                ("SchoolId", schoolId)
            );
        }

        public async Task<(IEnumerable<Teacher> Data, int TotalCount)> GetTeachersPagedAsync(
            int? schoolId,
            int? academicYearId,
            int page,
            int pageSize,
            string? sortBy,
            string? sortOrder,
            string? search,
            string? status,
            string? subject)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var list = new List<Teacher>();
                int totalCount = 0;

                var connection = _context.Database.GetDbConnection();
                if (connection.State == System.Data.ConnectionState.Closed)
                {
                    await _context.Database.OpenConnectionAsync();
                }

                using var command = connection.CreateCommand();
                command.CommandText = "dbo.sp_GetTeachersPaged";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                void AddParam(string name, object? val)
                {
                    var param = command.CreateParameter();
                    param.ParameterName = name.StartsWith("@") ? name : "@" + name;
                    param.Value = val ?? DBNull.Value;
                    command.Parameters.Add(param);
                }

                AddParam("SchoolId", schoolId);
                AddParam("AcademicYearId", academicYearId);
                AddParam("Page", page);
                AddParam("PageSize", pageSize);
                AddParam("SortBy", sortBy);
                AddParam("SortOrder", sortOrder);
                AddParam("Search", search);
                AddParam("Status", status);
                AddParam("Subject", subject);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var item = new Teacher
                    {
                        Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                        UserId = reader["UserId"] != DBNull.Value ? Convert.ToInt32(reader["UserId"]) : 0,
                        ContactNumber = reader["ContactNumber"] != DBNull.Value ? reader["ContactNumber"].ToString() : null,
                        Department = reader["Department"] != DBNull.Value ? reader["Department"].ToString() : null,
                        Qualification = reader["Qualification"] != DBNull.Value ? reader["Qualification"].ToString() : null,
                        Status = reader["Status"] != DBNull.Value ? reader["Status"].ToString() : "Active",
                        SchoolId = reader["SchoolId"] != DBNull.Value ? Convert.ToInt32(reader["SchoolId"]) : 0,
                        ProfilePhotoPath = reader["ProfilePhotoPath"] != DBNull.Value ? reader["ProfilePhotoPath"].ToString() : null,
                        EmployeeId = reader["EmployeeId"] != DBNull.Value ? reader["EmployeeId"].ToString() : null,
                        Experience = reader["Experience"] != DBNull.Value ? reader["Experience"].ToString() : null,
                        Subject = reader["Subject"] != DBNull.Value ? reader["Subject"].ToString() : null,
                        StandardId = reader["StandardId"] != DBNull.Value ? Convert.ToInt32(reader["StandardId"]) : null,
                        SectionId = reader["SectionId"] != DBNull.Value ? Convert.ToInt32(reader["SectionId"]) : null,
                        CreatedOn = reader["CreatedOn"] != DBNull.Value ? Convert.ToDateTime(reader["CreatedOn"]) : DateTime.UtcNow,
                        ModifiedOn = reader["ModifiedOn"] != DBNull.Value ? Convert.ToDateTime(reader["ModifiedOn"]) : DateTime.UtcNow,
                        CreatedBy = reader["CreatedBy"] != DBNull.Value ? reader["CreatedBy"].ToString() : null,
                        ModifiedBy = reader["ModifiedBy"] != DBNull.Value ? reader["ModifiedBy"].ToString() : null,
                        IsDeleted = reader["IsDeleted"] != DBNull.Value && Convert.ToBoolean(reader["IsDeleted"])
                    };

                    if (reader["UserName"] != DBNull.Value || reader["UserEmail"] != DBNull.Value)
                    {
                        item.User = new User
                        {
                            Id = item.UserId,
                            Name = reader["UserName"] != DBNull.Value ? reader["UserName"].ToString() : "",
                            Email = reader["UserEmail"] != DBNull.Value ? reader["UserEmail"].ToString() : "",
                            Role = ""
                        };
                    }

                    if (reader["TotalCount"] != DBNull.Value)
                    {
                        totalCount = Convert.ToInt32(reader["TotalCount"]);
                    }

                    list.Add(item);
                }

                return ((IEnumerable<Teacher>)list, totalCount);
            });
        }

        public async Task<Teacher?> GetTeacherByIdAsync(int id)
        {
            var list = await GetTeachersAsync(null);
            return list.FirstOrDefault(t => t.Id == id);
        }

        public async Task<Teacher> CreateTeacherAsync(Teacher teacher)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // If no UserId represents a valid link, and a new nested User is available, register it first
                    if (teacher.UserId <= 0 && teacher.User != null)
                    {
                        teacher.User.PasswordHash = string.IsNullOrEmpty(teacher.User.PasswordHash) ? "password123" : teacher.User.PasswordHash;
                        teacher.User.Id = await DbMapper.ExecuteScalarStoredProcedureAsync(
                            _context,
                            "dbo.sp_ManageUser",
                            ("Action", "INSERT"),
                            ("Id", null),
                            ("Username", teacher.User.Username),
                            ("PasswordHash", teacher.User.PasswordHash),
                            ("Name", teacher.User.Name),
                            ("Email", teacher.User.Email),
                            ("Role", teacher.User.Role),
                            ("RoleId", teacher.User.RoleId),
                            ("SchoolId", teacher.User.SchoolId),
                            ("CreatedBy", teacher.CreatedBy)
                        );
                        teacher.UserId = teacher.User.Id;
                    }

                    // Execute the sp_ManageTeacher stored procedure safely using high-performance ADO.NET DbMapper 
                    // to retrieve the newly generated identity, completely avoiding EF Core query wrapping issues.
                    teacher.Id = await DbMapper.ExecuteScalarStoredProcedureAsync(
                        _context,
                        "dbo.sp_ManageTeacher",
                        ("Action", "INSERT"),
                        ("Id", null),
                        ("UserId", teacher.UserId),
                        ("ContactNumber", teacher.ContactNumber),
                        ("Department", teacher.Department),
                        ("Qualification", teacher.Qualification),
                        ("Status", teacher.Status),
                        ("SchoolId", teacher.SchoolId),
                        ("ProfilePhotoPath", teacher.ProfilePhotoPath),
                        ("EmployeeId", teacher.EmployeeId),
                        ("Experience", teacher.Experience),
                        ("Subject", teacher.Subject),
                        ("StandardId", teacher.StandardId),
                        ("SectionId", teacher.SectionId),
                        ("CreatedBy", teacher.CreatedBy),
                        ("ModifiedBy", teacher.CreatedBy)
                    );

                    await transaction.CommitAsync();
                    return teacher;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    FileLogger.LogError(new Exception($"Failed to complete CreateTeacherAsync transaction for Teacher. Rolled back.", ex));
                    throw;
                }
            });
        }

        public async Task<bool> UpdateTeacherAsync(Teacher teacher)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                        $"EXEC dbo.sp_ManageTeacher 'UPDATE', {teacher.Id}, {teacher.UserId}, {teacher.ContactNumber}, {teacher.Department}, {teacher.Qualification}, {teacher.Status}, {teacher.SchoolId}, {teacher.ProfilePhotoPath}, {teacher.EmployeeId}, {teacher.Experience}, {teacher.Subject}, {teacher.StandardId}, {teacher.SectionId}, NULL, {teacher.ModifiedBy}"
                    );

                    // Also update the linked user account details if they were modified
                    if (teacher.User != null && teacher.UserId > 0)
                    {
                        var user = await _context.Users.FindAsync(teacher.UserId);
                        if (user != null)
                        {
                            user.Name = teacher.User.Name;
                            user.Email = teacher.User.Email;
                            user.ModifiedOn = DateTime.Now;
                            await _context.SaveChangesAsync();
                        }
                    }

                    await transaction.CommitAsync();
                    return rowsAffected >= 0 || rowsAffected == -1;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    FileLogger.LogError(new Exception($"Failed to complete UpdateTeacherAsync transaction for TeacherId: {teacher.Id}. Rolled back.", ex));
                    throw;
                }
            });
        }

        public async Task<bool> DeleteTeacherAsync(int id)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageTeacher 'DELETE', {id}"
                );
                return rowsAffected >= 0 || rowsAffected == -1;
            });
        }

        public async Task<bool> SavePhotoPathAsync(int id, string path)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Core optimization: Update ProfilePhotoPath directly with parameterized SQL execution
                // to completely bypass EF Core ChangeTracker and avoid save-concurrency issues.
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"UPDATE [dbo].[Teachers] SET [ProfilePhotoPath] = {path}, [ModifiedOn] = GETUTCDATE() WHERE [Id] = {id}"
                );
                return rowsAffected > 0;
            });
        }
    }
}
