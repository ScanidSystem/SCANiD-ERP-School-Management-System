#pragma warning disable CS8604 // Disable warning for possible null reference argument for parameter 'parameters' in SqlQueryRaw
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled SchoolService realization invoking stored procedures.
    /// Provides better performance and decoupled architecture.
    /// </summary>
    public class SchoolService : ISchoolService
    {
        private readonly ApplicationDbContext _context;

        public SchoolService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<School>> GetSchoolsAsync()
        {
            return await _context.Schools
                .FromSqlRaw("EXEC dbo.sp_GetSchools")
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<School?> GetSchoolByIdAsync(int id)
        {
            var list = await GetSchoolsAsync();
            return list.FirstOrDefault(s => s.Id == id);
        }

        public async Task<School> CreateSchoolAsync(School school)
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
                ("CreatedBy", null)
            );
            return school;
        }

        public async Task<bool> UpdateSchoolAsync(School school)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageSchool 'UPDATE', {school.Id}, {school.Name}, {school.ProfilePhotoPath}, {school.Address}, {school.Phone}, {school.Email}"
            );
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteSchoolAsync(int id)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageSchool 'DELETE', {id}"
            );
            return rowsAffected > 0;
        }

        public async Task<bool> SavePhotoPathAsync(int id, string path)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return false;

            school.ProfilePhotoPath = path;
            school.ModifiedOn = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
