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
    /// Decoupled StudentService realization calling high-performance Stored Procedures.
    /// This keeps the domain boundary highly optimized and adheres to SOLID design structures.
    /// Handles database transactions, rollbacks, and deadlock recovery transparently.
    /// </summary>
    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
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
        /// Retrieves non-deleted students matching filters via sp_GetStudents.
        /// </summary>
        public async Task<IEnumerable<Student>> GetStudentsAsync(int? schoolId, int? academicYearId)
        {
            // Core optimization: Execute sp_GetStudents containing SQL joins and handle relation mapping in-memory via DbMapper.
            // This is extremely high performing and scales to huge datasets, completely bypassing Entity Framework .Include() overhead.
            return await DbMapper.ExecuteStoredProcedureAsync<Student>(
                _context,
                "dbo.sp_GetStudents",
                ("SchoolId", schoolId),
                ("AcademicYearId", academicYearId)
            );
        }

        /// <summary>
        /// Retrieves a single student record via sp_GetStudentById.
        /// </summary>
        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            var list = await _context.Students
                .FromSqlInterpolated($"EXEC dbo.sp_GetStudentById {id}")
                .IgnoreQueryFilters()
                .AsNoTracking()
                .ToListAsync();
            return list.FirstOrDefault();
        }

        /// <summary>
        /// Registers a single student with auditing properties. Handles deadlocks resiliently.
        /// </summary>
        public async Task<Student> CreateStudentAsync(Student student)
        {
            student.RegistrationNumber = student.RegistrationNumber ?? "REG-" + UPPER_RAND_STRING();
            student.Status = student.Status ?? "Active";

            return await ExecuteWithRetryAsync(async () =>
            {
                // Execute the sp_ManageStudent stored procedure safely using high-performance ADO.NET DbMapper 
                // to retrieve the newly generated identity, completely avoiding EF Core query wrapping issues.
                student.Id = await DbMapper.ExecuteScalarStoredProcedureAsync(
                    _context,
                    "dbo.sp_ManageStudent",
                    ("Action", "INSERT"),
                    ("Id", null),
                    ("RegistrationNumber", student.RegistrationNumber),
                    ("Name", student.Name),
                    ("SchoolId", student.SchoolId),
                    ("StandardId", student.StandardId),
                    ("SectionId", student.SectionId),
                    ("AcademicYearId", student.AcademicYearId),
                    ("RollNumber", student.RollNumber),
                    ("GRNO", student.GRNO),
                    ("GENDER", student.GENDER),
                    ("DOB", student.DOB),
                    ("CategoryId", student.CategoryId),
                    ("ReligionId", student.ReligionId),
                    ("CasteId", student.CasteId),
                    ("Status", student.Status),
                    ("MOBILE", student.MOBILE),
                    ("ADDRESS", student.ADDRESS),
                    ("MOTHERNAME", student.MOTHERNAME),
                    ("aadharcard", student.aadharcard),
                    ("RFID", student.RFID),
                    ("ShiftId", student.ShiftId),
                    ("BloodGroupId", student.BloodGroupId),
                    ("HouseId", student.HouseId),
                    ("sms", student.sms),
                    ("uniformid", student.uniformid),
                    ("contact2", student.contact2),
                    ("ProfilePhotoPath", student.ProfilePhotoPath)
                );

                return student;
            });
        }

        /// <summary>
        /// Updates an edited student with deadlock retry safety.
        /// </summary>
        public async Task<bool> UpdateStudentAsync(Student student)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageStudent 'UPDATE', {student.Id}, {student.RegistrationNumber}, {student.Name}, {student.SchoolId}, {student.StandardId}, {student.SectionId}, {student.AcademicYearId}, {student.RollNumber}, {student.GRNO}, {student.GENDER}, {student.DOB}, {student.CategoryId}, {student.ReligionId}, {student.CasteId}, {student.Status}, {student.MOBILE}, {student.ADDRESS}, {student.MOTHERNAME}, {student.aadharcard}, {student.RFID}, {student.ShiftId}, {student.BloodGroupId}, {student.HouseId}, {student.sms}, {student.uniformid}, {student.contact2}, {student.ProfilePhotoPath}"
                );
                return rowsAffected > 0;
            });
        }

        /// <summary>
        /// Validates unique fields and bulk creates multiple students within a single transaction with automatic rollbacks.
        /// </summary>
        public async Task<object> CreateBulkStudentsAsync(IEnumerable<Student> students)
        {
            if (students == null || !students.Any())
                throw new ArgumentException("No student data provided.");

            // Standard bulk business check for duplicates before committing to SQL
            var allStudents = await DbMapper.ExecuteStoredProcedureAsync<Student>(_context, "dbo.sp_GetStudents");
            var dbStudents = allStudents
                .Select(s => new { s.RegistrationNumber, s.GRNO, s.aadharcard, s.RFID, s.uniformid })
                .ToList();

            var dbRegs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var dbs in dbStudents)
            {
                if (!string.IsNullOrEmpty(dbs.RegistrationNumber)) dbRegs.Add(dbs.RegistrationNumber.Trim());
                if (!string.IsNullOrEmpty(dbs.GRNO)) dbRegs.Add(dbs.GRNO.Trim());
                if (!string.IsNullOrEmpty(dbs.aadharcard)) dbAadhars.Add(dbs.aadharcard.Trim());
                if (!string.IsNullOrEmpty(dbs.RFID)) dbRfids.Add(dbs.RFID.Trim());
                if (!string.IsNullOrEmpty(dbs.uniformid)) dbUniforms.Add(dbs.uniformid.Trim());
            }

            var batchRegs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            int index = 1;
            foreach (var s in students)
            {
                var reg = (s.RegistrationNumber ?? s.GRNO ?? "").Trim();
                if (!string.IsNullOrEmpty(reg))
                {
                    if (batchRegs.Contains(reg) || dbRegs.Contains(reg))
                        throw new InvalidOperationException($"Row {index}: Duplicate Registration Number/GRNO '{reg}' detected.");
                    batchRegs.Add(reg);
                }

                var grno = (s.GRNO ?? "").Trim();
                if (!string.IsNullOrEmpty(grno))
                {
                    if (batchRegs.Contains(grno) || dbRegs.Contains(grno))
                        throw new InvalidOperationException($"Row {index}: Duplicate Registration Number/GRNO '{grno}' detected.");
                    batchRegs.Add(grno);
                }

                var aadhar = (s.aadharcard ?? "").Trim();
                if (!string.IsNullOrEmpty(aadhar))
                {
                    if (batchAadhars.Contains(aadhar) || dbAadhars.Contains(aadhar))
                        throw new InvalidOperationException($"Row {index}: Duplicate Aadhar Card '{aadhar}' detected.");
                    batchAadhars.Add(aadhar);
                }

                var rfid = (s.RFID ?? "").Trim();
                if (!string.IsNullOrEmpty(rfid))
                {
                    if (batchRfids.Contains(rfid) || dbRfids.Contains(rfid))
                        throw new InvalidOperationException($"Row {index}: Duplicate RFID/CardID '{rfid}' detected.");
                    batchRfids.Add(rfid);
                }

                var uniform = (s.uniformid ?? "").Trim();
                if (!string.IsNullOrEmpty(uniform))
                {
                    if (batchUniforms.Contains(uniform) || dbUniforms.Contains(uniform))
                        throw new InvalidOperationException($"Row {index}: Duplicate UniformID '{uniform}' detected.");
                    batchUniforms.Add(uniform);
                }

                index++;
            }

            // Perform transaction scoped bulk insert loops
            return await ExecuteWithRetryAsync<object>(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    foreach (var s in students)
                    {
                        s.RegistrationNumber = s.RegistrationNumber ?? "REG-" + UPPER_RAND_STRING();
                        // Execute the sp_ManageStudent stored procedure safely using high-performance ADO.NET DbMapper 
                        // to retrieve the newly generated identity, completely avoiding EF Core query wrapping issues.
                        s.Id = await DbMapper.ExecuteScalarStoredProcedureAsync(
                            _context,
                            "dbo.sp_ManageStudent",
                            ("Action", "INSERT"),
                            ("Id", null),
                            ("RegistrationNumber", s.RegistrationNumber),
                            ("Name", s.Name),
                            ("SchoolId", s.SchoolId),
                            ("StandardId", s.StandardId),
                            ("SectionId", s.SectionId),
                            ("AcademicYearId", s.AcademicYearId),
                            ("RollNumber", s.RollNumber),
                            ("GRNO", s.GRNO),
                            ("GENDER", s.GENDER),
                            ("DOB", s.DOB),
                            ("CategoryId", s.CategoryId),
                            ("ReligionId", s.ReligionId),
                            ("CasteId", s.CasteId),
                            ("Status", s.Status),
                            ("MOBILE", s.MOBILE),
                            ("ADDRESS", s.ADDRESS),
                            ("MOTHERNAME", s.MOTHERNAME),
                            ("aadharcard", s.aadharcard),
                            ("RFID", s.RFID),
                            ("ShiftId", s.ShiftId),
                            ("BloodGroupId", s.BloodGroupId),
                            ("HouseId", s.HouseId),
                            ("sms", s.sms),
                            ("uniformid", s.uniformid),
                            ("contact2", s.contact2),
                            ("ProfilePhotoPath", s.ProfilePhotoPath)
                        );
                    }

                    await transaction.CommitAsync();
                    return new { count = students.Count(), message = "Bulk upload successful" };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    FileLogger.LogError(new Exception("Bulk student insert transaction failed. Rolling back all inserts.", ex));
                    throw;
                }
            });
        }

        /// <summary>
        /// Soft deletes student record using sp_ManageStudent with deadlock retry safety.
        /// </summary>
        public async Task<bool> DeleteStudentAsync(int id)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"EXEC dbo.sp_ManageStudent 'DELETE', {id}"
                );
                return rowsAffected > 0;
            });
        }

        /// <summary>
        /// Loads student coupled with relationships for photo uploads.
        /// </summary>
        public async Task<Student?> GetStudentWithPhotoDetailsAsync(int id)
        {
            // Core optimization: Execute sp_GetStudentWithPhotoDetails with pre-compiled joins and map dynamically in-memory.
            var list = await DbMapper.ExecuteStoredProcedureAsync<Student>(
                _context,
                "dbo.sp_GetStudentWithPhotoDetails",
                ("Id", id)
            );
            return list.FirstOrDefault();
        }

        /// <summary>
        /// Retrieves students definition for exports.
        /// </summary>
        public async Task<IEnumerable<Student>> GetStudentsForExportAsync(int? schoolId)
        {
            // Core optimization: Execute sp_GetStudentsForExport containing the full set of joins, mapping relations via DbMapper for extreme scale.
            return await DbMapper.ExecuteStoredProcedureAsync<Student>(
                _context,
                "dbo.sp_GetStudentsForExport",
                ("SchoolId", schoolId)
            );
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private static string UPPER_RAND_STRING()
        {
            return Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }
    }
}
