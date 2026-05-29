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
using System.Reflection;
using System.Threading.Tasks;
using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore.Storage;

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
        private static readonly Dictionary<Type, PropertyInfo[]> StudentPropCache = new();

        private static PropertyInfo[] GetStudentProperties(Type type)
        {
            if (!StudentPropCache.TryGetValue(type, out var props))
            {
                props = type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                            .Where(p => p.CanWrite && (p.PropertyType.IsPrimitive || 
                                                      p.PropertyType == typeof(string) || 
                                                      p.PropertyType == typeof(decimal) || 
                                                      p.PropertyType == typeof(DateTime) || 
                                                      p.PropertyType == typeof(Guid) || 
                                                      p.PropertyType.IsEnum ||
                                                      Nullable.GetUnderlyingType(p.PropertyType) != null))
                            .ToArray();
                StudentPropCache[type] = props;
            }
            return props;
        }

        /// <summary>
        /// Retrieves non-deleted students from SQL Server using server-side pagination, paging, sorting, and caching.
        /// Fully optimized for sets of 50 to 90 lakhs+ records.
        /// </summary>
        public async Task<(IEnumerable<Student> Data, int TotalCount)> GetStudentsPagedAsync(
            int? schoolId, 
            int? academicYearId,
            int page,
            int pageSize,
            string? sortBy,
            string sortOrder,
            string? search,
            int? standardId,
            int? sectionId,
            int? lastId)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var list = new List<Student>();
                int totalCount = 0;

                var connection = _context.Database.GetDbConnection();
                if (connection.State == ConnectionState.Closed)
                {
                    await _context.Database.OpenConnectionAsync();
                }

                using var command = connection.CreateCommand();
                command.CommandText = "dbo.sp_GetStudentsPaged";
                command.CommandType = CommandType.StoredProcedure;

                // Add parameters
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
                AddParam("StandardId", standardId);
                AddParam("SectionId", sectionId);
                AddParam("LastId", lastId);

                using var reader = await command.ExecuteReaderAsync();
                var columns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    columns.Add(reader.GetName(i));
                }

                var entityType = typeof(Student);
                var props = GetStudentProperties(entityType);

                while (await reader.ReadAsync())
                {
                    var item = new Student();
                    foreach (var prop in props)
                    {
                        if (columns.Contains(prop.Name))
                        {
                            var val = reader[prop.Name];
                            if (val != DBNull.Value)
                            {
                                var underlyingType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                                prop.SetValue(item, Convert.ChangeType(val, underlyingType));
                            }
                        }
                    }

                    // Map navigational entities from joins using the reader
                    if (columns.Contains("StandardName") && reader["StandardName"] != DBNull.Value)
                    {
                        item.Standard = new Standard { Name = reader["StandardName"].ToString() ?? string.Empty };
                    }
                    if (columns.Contains("SectionName") && reader["SectionName"] != DBNull.Value)
                    {
                        item.Section = new Section { Name = reader["SectionName"].ToString() ?? string.Empty };
                    }
                    if (columns.Contains("AcademicYearName") && reader["AcademicYearName"] != DBNull.Value)
                    {
                        item.AcademicYear = new AcademicYear { Name = reader["AcademicYearName"].ToString() ?? string.Empty };
                    }
                    if (columns.Contains("CityName") && reader["CityName"] != DBNull.Value)
                    {
                        item.City = new City { Name = reader["CityName"].ToString() ?? string.Empty };
                    }
                    if (columns.Contains("StateName") && reader["StateName"] != DBNull.Value)
                    {
                        item.State = new State { Name = reader["StateName"].ToString() ?? string.Empty };
                    }

                    // Get total count from TotalCount column
                    if (columns.Contains("TotalCount") && reader["TotalCount"] != DBNull.Value)
                    {
                        totalCount = Convert.ToInt32(reader["TotalCount"]);
                    }

                    list.Add(item);
                }

                return ((IEnumerable<Student>)list, totalCount);
            });
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
            student.Status = student.Status ?? "Active";

            return await ExecuteWithRetryAsync(async () =>
            {
                // Validate GrNo uniqueness from overall academics
                if (!string.IsNullOrEmpty(student.GrNo))
                {
                    bool grNoExists = await _context.Students.AnyAsync(s => s.GrNo == student.GrNo && !s.IsDeleted);
                    if (grNoExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: GrNo '{student.GrNo}' already exists.");
                    }
                }

                // Validate RFID uniqueness if entered
                if (!string.IsNullOrEmpty(student.Rfid))
                {
                    bool rfidExists = await _context.Students.AnyAsync(s => s.Rfid == student.Rfid && !s.IsDeleted);
                    if (rfidExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: RFID '{student.Rfid}' already exists.");
                    }
                }

                // Validate Roll No uniqueness per combination of school, standard, division
                if (student.StandardId.HasValue && student.SectionId.HasValue)
                {
                    bool rollExists = await _context.Students.AnyAsync(s => 
                        s.SchoolId == student.SchoolId && 
                        s.StandardId == student.StandardId && 
                        s.SectionId == student.SectionId && 
                        s.RollNumber == student.RollNumber && 
                        !s.IsDeleted);
                    if (rollExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: Roll No '{student.RollNumber}' already exists for this combination of Standard and Division.");
                    }
                }

                // Execute the sp_ManageStudent stored procedure safely using high-performance ADO.NET DbMapper 
                // to retrieve the newly generated identity, completely avoiding EF Core query wrapping issues.
                student.Id = await DbMapper.ExecuteScalarStoredProcedureAsync(
                    _context,
                    "dbo.sp_ManageStudent",
                    ("Action", "INSERT"),
                    ("Id", null),
                    ("Name", student.Name),
                    ("FirstName", student.FirstName),
                    ("MiddleName", student.MiddleName),
                    ("LastName", student.LastName),
                    ("SchoolId", student.SchoolId),
                    ("StandardId", student.StandardId),
                    ("SectionId", student.SectionId),
                    ("AcademicYearId", student.AcademicYearId),
                    ("RollNumber", student.RollNumber),
                    ("GrNo", student.GrNo),
                    ("Gender", student.Gender),
                    ("DateOfBirth", student.DateOfBirth),
                    ("CategoryId", student.CategoryId),
                    ("ReligionId", student.ReligionId),
                    ("CasteId", student.CasteId),
                    ("SubCasteId", student.SubCasteId),
                    ("Status", student.Status),
                    ("FatherContactNo", student.FatherContactNo),
                    ("Address", student.Address),
                    ("MotherName", student.MotherName),
                    ("AadharCard", student.AadharCard),
                    ("Rfid", student.Rfid),
                    ("ShiftId", student.ShiftId),
                    ("BloodGroupId", student.BloodGroupId),
                    ("HouseId", student.HouseId),
                    ("AdmissionTypeId", student.AdmissionTypeId),
                    ("Sms", student.Sms),
                    ("UniformId", student.UniformId),
                    ("MotherContactNo", student.MotherContactNo),
                    ("ProfilePhotoPath", student.ProfilePhotoPath),
                    ("SchoolSectionId", student.SchoolSectionId),
                    ("AdmissionDate", student.AdmissionDate),
                    ("Email", student.Email),
                    ("CityId", student.CityId),
                    ("StateId", student.StateId),
                    ("IsStateBoard", student.IsStateBoard),
                    ("DigitalUniform", student.DigitalUniform),
                    ("DigitalNotebook", student.DigitalNotebook),
                    ("OptedForBus", student.OptedForBus),
                    ("CreatedBy", student.CreatedBy),
                    ("ModifiedBy", student.CreatedBy)
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
                // Validate GrNo uniqueness from overall academics
                if (!string.IsNullOrEmpty(student.GrNo))
                {
                    bool grNoExists = await _context.Students.AnyAsync(s => s.GrNo == student.GrNo && s.Id != student.Id && !s.IsDeleted);
                    if (grNoExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: GrNo '{student.GrNo}' already exists.");
                    }
                }

                // Validate RFID uniqueness if entered
                if (!string.IsNullOrEmpty(student.Rfid))
                {
                    bool rfidExists = await _context.Students.AnyAsync(s => s.Rfid == student.Rfid && s.Id != student.Id && !s.IsDeleted);
                    if (rfidExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: RFID '{student.Rfid}' already exists.");
                    }
                }

                // Validate Roll No uniqueness per combination of school, standard, division
                if (student.StandardId.HasValue && student.SectionId.HasValue)
                {
                    bool rollExists = await _context.Students.AnyAsync(s => 
                        s.SchoolId == student.SchoolId && 
                        s.StandardId == student.StandardId && 
                        s.SectionId == student.SectionId && 
                        s.RollNumber == student.RollNumber && 
                        s.Id != student.Id && 
                        !s.IsDeleted);
                    if (rollExists)
                    {
                        throw new InvalidOperationException($"Student validation failed: Roll No '{student.RollNumber}' already exists for this combination of Standard and Division.");
                    }
                }

                await DbMapper.ExecuteScalarStoredProcedureAsync(
                    _context,
                    "dbo.sp_ManageStudent",
                    ("Action", "UPDATE"),
                    ("Id", student.Id),
                    ("Name", student.Name),
                    ("FirstName", student.FirstName),
                    ("MiddleName", student.MiddleName),
                    ("LastName", student.LastName),
                    ("SchoolId", student.SchoolId),
                    ("StandardId", student.StandardId),
                    ("SectionId", student.SectionId),
                    ("AcademicYearId", student.AcademicYearId),
                    ("RollNumber", student.RollNumber),
                    ("GrNo", student.GrNo),
                    ("Gender", student.Gender),
                    ("DateOfBirth", student.DateOfBirth),
                    ("CategoryId", student.CategoryId),
                    ("ReligionId", student.ReligionId),
                    ("CasteId", student.CasteId),
                    ("SubCasteId", student.SubCasteId),
                    ("Status", student.Status),
                    ("FatherContactNo", student.FatherContactNo),
                    ("Address", student.Address),
                    ("MotherName", student.MotherName),
                    ("AadharCard", student.AadharCard),
                    ("Rfid", student.Rfid),
                    ("ShiftId", student.ShiftId),
                    ("BloodGroupId", student.BloodGroupId),
                    ("HouseId", student.HouseId),
                    ("AdmissionTypeId", student.AdmissionTypeId),
                    ("Sms", student.Sms),
                    ("UniformId", student.UniformId),
                    ("MotherContactNo", student.MotherContactNo),
                    ("ProfilePhotoPath", student.ProfilePhotoPath),
                    ("SchoolSectionId", student.SchoolSectionId),
                    ("AdmissionDate", student.AdmissionDate),
                    ("Email", student.Email),
                    ("CityId", student.CityId),
                    ("StateId", student.StateId),
                    ("IsStateBoard", student.IsStateBoard),
                    ("DigitalUniform", student.DigitalUniform),
                    ("DigitalNotebook", student.DigitalNotebook),
                    ("OptedForBus", student.OptedForBus),
                    ("ModifiedBy", student.ModifiedBy)
                );
                return true;
            });
        }

        /// <summary>
        /// Validates unique fields and bulk creates multiple students within a single transaction with automatic rollbacks.
        /// </summary>
        public async Task<object> CreateBulkStudentsAsync(IEnumerable<Student> students)
        {
            if (students == null || !students.Any())
                throw new ArgumentException("No student data provided.");

            // Standard bulk business check for duplicates by querying only the database records that match the uploaded batch.
            // This is critically scale-robust and prevents loading millions of rows (OutOfMemoryException) into memory.
            var incomingGrNos = students.Select(s => s.GrNo).Where(g => !string.IsNullOrEmpty(g)).Distinct().ToList();
            var incomingAadhars = students.Select(s => s.AadharCard).Where(a => !string.IsNullOrEmpty(a)).Distinct().ToList();
            var incomingRfids = students.Select(s => s.Rfid).Where(r => !string.IsNullOrEmpty(r)).Distinct().ToList();
            var incomingUniforms = students.Select(s => s.UniformId).Where(u => !string.IsNullOrEmpty(u)).Distinct().ToList();

            var dbStudents = await _context.Students
                .AsNoTracking()
                .Where(s => !s.IsDeleted && (
                    (s.GrNo != null && incomingGrNos.Contains(s.GrNo)) ||
                    (s.AadharCard != null && incomingAadhars.Contains(s.AadharCard)) ||
                    (s.Rfid != null && incomingRfids.Contains(s.Rfid)) ||
                    (s.UniformId != null && incomingUniforms.Contains(s.UniformId))
                ))
                .Select(s => new { s.GrNo, s.AadharCard, s.Rfid, s.UniformId })
                .ToListAsync();

            var dbGrNos = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var dbs in dbStudents)
            {
                if (!string.IsNullOrEmpty(dbs.GrNo)) dbGrNos.Add(dbs.GrNo.Trim());
                if (!string.IsNullOrEmpty(dbs.AadharCard)) dbAadhars.Add(dbs.AadharCard.Trim());
                if (!string.IsNullOrEmpty(dbs.Rfid)) dbRfids.Add(dbs.Rfid.Trim());
                if (!string.IsNullOrEmpty(dbs.UniformId)) dbUniforms.Add(dbs.UniformId.Trim());
            }

            // Uniqueness check for RollNumber per SchoolId, StandardId, SectionId combo
            var dbActiveRolls = await _context.Students
                .AsNoTracking()
                .Where(s => !s.IsDeleted && s.StandardId != null && s.SectionId != null)
                .Select(s => new { s.SchoolId, s.StandardId, s.SectionId, s.RollNumber })
                .ToListAsync();

            var dbRollKeys = new HashSet<string>();
            foreach (var r in dbActiveRolls)
            {
                dbRollKeys.Add($"{r.SchoolId}-{r.StandardId}-{r.SectionId}-{r.RollNumber}");
            }

            var batchGrNos = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchRollKeys = new HashSet<string>();

            int index = 1;
            foreach (var s in students)
            {
                var grno = (s.GrNo ?? "").Trim();
                if (string.IsNullOrEmpty(grno))
                {
                    throw new InvalidOperationException($"Row {index}: GRNO is required and cannot be empty.");
                }
                if (batchGrNos.Contains(grno) || dbGrNos.Contains(grno))
                    throw new InvalidOperationException($"Row {index}: Duplicate GRNO '{grno}' detected.");
                batchGrNos.Add(grno);

                var aadhar = (s.AadharCard ?? "").Trim();
                if (!string.IsNullOrEmpty(aadhar))
                {
                    if (batchAadhars.Contains(aadhar) || dbAadhars.Contains(aadhar))
                        throw new InvalidOperationException($"Row {index}: Duplicate Aadhar Card '{aadhar}' detected.");
                    batchAadhars.Add(aadhar);
                }

                var rfid = (s.Rfid ?? "").Trim();
                if (!string.IsNullOrEmpty(rfid))
                {
                    if (batchRfids.Contains(rfid) || dbRfids.Contains(rfid))
                        throw new InvalidOperationException($"Row {index}: Duplicate RFID '{rfid}' detected.");
                    batchRfids.Add(rfid);
                }

                var uniform = (s.UniformId ?? "").Trim();
                if (!string.IsNullOrEmpty(uniform))
                {
                    if (batchUniforms.Contains(uniform) || dbUniforms.Contains(uniform))
                        throw new InvalidOperationException($"Row {index}: Duplicate UniformID '{uniform}' detected.");
                    batchUniforms.Add(uniform);
                }

                if (s.StandardId.HasValue && s.SectionId.HasValue)
                {
                    var rollKey = $"{s.SchoolId}-{s.StandardId}-{s.SectionId}-{s.RollNumber}";
                    if (batchRollKeys.Contains(rollKey) || dbRollKeys.Contains(rollKey))
                        throw new InvalidOperationException($"Row {index}: Duplicate Roll Number '{s.RollNumber}' detected for this combination of School, Standard and Division.");
                    batchRollKeys.Add(rollKey);
                }

                index++;
            }

            // Perform transaction scoped high-performance SqlBulkCopy
            return await ExecuteWithRetryAsync<object>(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var connection = (SqlConnection)_context.Database.GetDbConnection();
                    if (connection.State != System.Data.ConnectionState.Open)
                    {
                        await connection.OpenAsync();
                    }

                    var dbTransaction = (SqlTransaction)transaction.GetDbTransaction();

                    // Create a schema-aligned DataTable to stream student records via TDS bulk protocols
                    using var table = new System.Data.DataTable();
                    table.Columns.Add("Name", typeof(string));
                    table.Columns.Add("SchoolId", typeof(int));
                    table.Columns.Add("Status", typeof(string));
                    table.Columns.Add("RollNumber", typeof(int));
                    table.Columns.Add("FirstName", typeof(string));
                    table.Columns.Add("MiddleName", typeof(string));
                    table.Columns.Add("LastName", typeof(string));
                    table.Columns.Add("GrNo", typeof(string));
                    table.Columns.Add("Gender", typeof(string));
                    table.Columns.Add("DateOfBirth", typeof(DateTime));
                    table.Columns.Add("Address", typeof(string));
                    table.Columns.Add("MotherName", typeof(string));
                    table.Columns.Add("FatherContactNo", typeof(string));
                    table.Columns.Add("MotherContactNo", typeof(string));
                    table.Columns.Add("AadharCard", typeof(string));
                    table.Columns.Add("UniformId", typeof(string));
                    table.Columns.Add("Rfid", typeof(string));
                    table.Columns.Add("SchoolSectionId", typeof(int));
                    table.Columns.Add("AdmissionDate", typeof(DateTime));
                    table.Columns.Add("Email", typeof(string));
                    table.Columns.Add("StandardId", typeof(int));
                    table.Columns.Add("SectionId", typeof(int));
                    table.Columns.Add("AcademicYearId", typeof(int));
                    table.Columns.Add("CasteId", typeof(int));
                    table.Columns.Add("SubCasteId", typeof(int));
                    table.Columns.Add("ReligionId", typeof(int));
                    table.Columns.Add("BloodGroupId", typeof(int));
                    table.Columns.Add("HouseId", typeof(int));
                    table.Columns.Add("AdmissionTypeId", typeof(int));
                    table.Columns.Add("CityId", typeof(int));
                    table.Columns.Add("StateId", typeof(int));
                    table.Columns.Add("ShiftId", typeof(int));
                    table.Columns.Add("CategoryId", typeof(int));
                    table.Columns.Add("Sms", typeof(bool));
                    table.Columns.Add("IsStateBoard", typeof(bool));
                    table.Columns.Add("ProfilePhotoPath", typeof(string));
                    table.Columns.Add("DigitalUniform", typeof(bool));
                    table.Columns.Add("DigitalNotebook", typeof(bool));
                    table.Columns.Add("OptedForBus", typeof(bool));
                    table.Columns.Add("IsActive", typeof(bool));
                    table.Columns.Add("IsDeleted", typeof(bool));
                    table.Columns.Add("CreatedBy", typeof(string));
                    table.Columns.Add("CreatedOn", typeof(DateTime));
                    table.Columns.Add("ModifiedBy", typeof(string));
                    table.Columns.Add("ModifiedOn", typeof(DateTime));

                    foreach (var s in students)
                    {
                        table.Rows.Add(
                            s.Name ?? string.Empty,
                            s.SchoolId,
                            s.Status ?? "Active",
                            s.RollNumber,
                            (object?)s.FirstName ?? DBNull.Value,
                            (object?)s.MiddleName ?? DBNull.Value,
                            (object?)s.LastName ?? DBNull.Value,
                            (object?)s.GrNo ?? DBNull.Value,
                            (object?)s.Gender ?? DBNull.Value,
                            (object?)s.DateOfBirth ?? DBNull.Value,
                            (object?)s.Address ?? DBNull.Value,
                            (object?)s.MotherName ?? DBNull.Value,
                            (object?)s.FatherContactNo ?? DBNull.Value,
                            (object?)s.MotherContactNo ?? DBNull.Value,
                            (object?)s.AadharCard ?? DBNull.Value,
                            (object?)s.UniformId ?? DBNull.Value,
                            (object?)s.Rfid ?? DBNull.Value,
                            (object?)s.SchoolSectionId ?? DBNull.Value,
                            (object?)s.AdmissionDate ?? DBNull.Value,
                            (object?)s.Email ?? DBNull.Value,
                            (object?)s.StandardId ?? DBNull.Value,
                            (object?)s.SectionId ?? DBNull.Value,
                            (object?)s.AcademicYearId ?? DBNull.Value,
                            (object?)s.CasteId ?? DBNull.Value,
                            (object?)s.SubCasteId ?? DBNull.Value,
                            (object?)s.ReligionId ?? DBNull.Value,
                            (object?)s.BloodGroupId ?? DBNull.Value,
                            (object?)s.HouseId ?? DBNull.Value,
                            (object?)s.AdmissionTypeId ?? DBNull.Value,
                            (object?)s.CityId ?? DBNull.Value,
                            (object?)s.StateId ?? DBNull.Value,
                            (object?)s.ShiftId ?? DBNull.Value,
                            (object?)s.CategoryId ?? DBNull.Value,
                            s.Sms,
                            s.IsStateBoard,
                            (object?)s.ProfilePhotoPath ?? DBNull.Value,
                            s.DigitalUniform,
                            s.DigitalNotebook,
                            s.OptedForBus,
                            s.IsActive,
                            s.IsDeleted,
                            (object?)s.CreatedBy ?? "SYSTEM",
                            s.CreatedOn == default ? DateTime.UtcNow : s.CreatedOn,
                            (object?)s.ModifiedBy ?? "SYSTEM",
                            s.ModifiedOn == default ? DateTime.UtcNow : s.ModifiedOn
                        );
                    }

                    using (var bulkCopy = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, dbTransaction))
                    {
                        bulkCopy.DestinationTableName = "[dbo].[Students]";
                        bulkCopy.BulkCopyTimeout = 600; // 10 minutes timeout
                        bulkCopy.BatchSize = 10000; // Process in blocks of 10k

                        foreach (System.Data.DataColumn col in table.Columns)
                        {
                            bulkCopy.ColumnMappings.Add(col.ColumnName, col.ColumnName);
                        }

                        await bulkCopy.WriteToServerAsync(table);
                    }

                    await transaction.CommitAsync();
                    return new { count = students.Count(), message = "Bulk upload successful" };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    FileLogger.LogError(new Exception("Bulk student insert transaction failed via SqlBulkCopy. Rolling back all inserts.", ex));
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

        public async Task<bool> SavePhotoPathAsync(int id, string path)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                // Execute a direct parameterized raw SQL query to update the photo path, 
                // avoiding any EF Core change tracking issues with disconnected entities.
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                    $"UPDATE [dbo].[Students] SET [ProfilePhotoPath] = {path}, [ModifiedOn] = GETUTCDATE() WHERE [Id] = {id}"
                );
                return rowsAffected > 0;
            });
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
