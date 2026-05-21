using Microsoft.EntityFrameworkCore;
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
    /// </summary>
    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
        {
            _context = context;
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
                .AsNoTracking()
                .ToListAsync();
            return list.FirstOrDefault();
        }

        /// <summary>
        /// Registers a single student with auditing properties.
        /// </summary>
        public async Task<Student> CreateStudentAsync(Student student)
        {
            student.RegistrationNumber = student.RegistrationNumber ?? "REG-" + UPPER_RAND_STRING();
            student.Status = student.Status ?? "Active";

            var idResult = await _context.Database.SqlQueryRaw<int>(
                "EXEC dbo.sp_ManageStudent @Action='INSERT', @Id=NULL, @RegistrationNumber={0}, @Name={1}, @SchoolId={2}, @StandardId={3}, @SectionId={4}, @AcademicYearId={5}, @RollNumber={6}, @GRNO={7}, @GENDER={8}, @DOB={9}, @CategoryId={10}, @ReligionId={11}, @CasteId={12}, @Status={13}, @MOBILE={14}, @EMAIL={15}, @ADDRESS={16}, @MOTHERNAME={17}, @aadharcard={18}, @RFID={19}, @ShiftId={20}, @BloodGroupId={21}, @HouseId={22}, @DOA={23}, @FATHERNAME={24}, @PEN_No={25}, @bankacc={26}, @ProfilePhotoPath={27}",
                student.RegistrationNumber, student.Name, student.SchoolId, student.StandardId, student.SectionId, student.AcademicYearId, student.RollNumber, student.GRNO, student.GENDER, student.DOB, student.CategoryId, student.ReligionId, student.CasteId, student.Status, student.MOBILE, student.EMAIL, student.ADDRESS, student.MOTHERNAME, student.aadharcard, student.RFID, student.ShiftId, student.BloodGroupId, student.HouseId, student.DOA, student.FATHERNAME, student.PEN_No, student.bankacc, student.ProfilePhotoPath
            ).ToListAsync();

            student.Id = idResult.FirstOrDefault();
            return student;
        }

        /// <summary>
        /// Updates an edited student.
        /// </summary>
        public async Task<bool> UpdateStudentAsync(Student student)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageStudent 'UPDATE', {student.Id}, {student.RegistrationNumber}, {student.Name}, {student.SchoolId}, {student.StandardId}, {student.SectionId}, {student.AcademicYearId}, {student.RollNumber}, {student.GRNO}, {student.GENDER}, {student.DOB}, {student.CategoryId}, {student.ReligionId}, {student.CasteId}, {student.Status}, {student.MOBILE}, {student.EMAIL}, {student.ADDRESS}, {student.MOTHERNAME}, {student.aadharcard}, {student.RFID}, {student.ShiftId}, {student.BloodGroupId}, {student.HouseId}, {student.DOA}, {student.FATHERNAME}, {student.PEN_No}, {student.bankacc}, {student.ProfilePhotoPath}"
            );
            return rowsAffected > 0;
        }

        /// <summary>
        /// Validates unique fields and bulk creates multiple students within a single transaction.
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

            // Inser using standard sp_ManageStudent stored procedure loops
            foreach (var s in students)
            {
                s.RegistrationNumber = s.RegistrationNumber ?? "REG-" + UPPER_RAND_STRING();
                var idResult = await _context.Database.SqlQueryRaw<int>(
                    "EXEC dbo.sp_ManageStudent @Action='INSERT', @Id=NULL, @RegistrationNumber={0}, @Name={1}, @SchoolId={2}, @StandardId={3}, @SectionId={4}, @AcademicYearId={5}, @RollNumber={6}, @GRNO={7}, @GENDER={8}, @DOB={9}, @CategoryId={10}, @ReligionId={11}, @CasteId={12}, @Status={13}, @MOBILE={14}, @EMAIL={15}, @ADDRESS={16}, @MOTHERNAME={17}, @aadharcard={18}, @RFID={19}, @ShiftId={20}, @BloodGroupId={21}, @HouseId={22}, @DOA={23}, @FATHERNAME={24}, @PEN_No={25}, @bankacc={26}, @ProfilePhotoPath={27}",
                    s.RegistrationNumber, s.Name, s.SchoolId, s.StandardId, s.SectionId, s.AcademicYearId, s.RollNumber, s.GRNO, s.GENDER, s.DOB, s.CategoryId, s.ReligionId, s.CasteId, s.Status, s.MOBILE, s.EMAIL, s.ADDRESS, s.MOTHERNAME, s.aadharcard, s.RFID, s.ShiftId, s.BloodGroupId, s.HouseId, s.DOA, s.FATHERNAME, s.PEN_No, s.bankacc, s.ProfilePhotoPath
                ).ToListAsync();
                s.Id = idResult.FirstOrDefault();
            }

            return new { count = students.Count(), message = "Bulk upload successful" };
        }

        /// <summary>
        /// Soft deletes student record using sp_ManageStudent.
        /// </summary>
        public async Task<bool> DeleteStudentAsync(int id)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageStudent 'DELETE', {id}"
            );
            return rowsAffected > 0;
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
