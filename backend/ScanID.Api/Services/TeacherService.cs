#pragma warning disable CS8604 // Disable warning for possible null reference argument for parameter 'parameters' in SqlQueryRaw
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
    /// Decoupled TeacherService realization calling high-performance Stored Procedures.
    /// This keeps professional catalog lookups highly optimized and maintains SOLID architectures.
    /// </summary>
    public class TeacherService : ITeacherService
    {
        private readonly ApplicationDbContext _context;

        public TeacherService(ApplicationDbContext context)
        {
            _context = context;
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

        public async Task<Teacher?> GetTeacherByIdAsync(int id)
        {
            var list = await GetTeachersAsync(null);
            return list.FirstOrDefault(t => t.Id == id);
        }

        public async Task<Teacher> CreateTeacherAsync(Teacher teacher)
        {
            var idResult = await _context.Database.SqlQueryRaw<int>(
                "EXEC dbo.sp_ManageTeacher @Action='INSERT', @Id=NULL, @UserId={0}, @ContactNumber={1}, @Department={2}, @Qualification={3}, @Status={4}, @SchoolId={5}, @ProfilePhotoPath={6}",
                teacher.UserId, teacher.ContactNumber, teacher.Department, teacher.Qualification, teacher.Status, teacher.SchoolId, teacher.ProfilePhotoPath
            ).ToListAsync();

            teacher.Id = idResult.FirstOrDefault();
            return teacher;
        }

        public async Task<bool> UpdateTeacherAsync(Teacher teacher)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageTeacher 'UPDATE', {teacher.Id}, {teacher.UserId}, {teacher.ContactNumber}, {teacher.Department}, {teacher.Qualification}, {teacher.Status}, {teacher.SchoolId}, {teacher.ProfilePhotoPath}"
            );

            // Also update the linked user account details if they were modified
            if (teacher.User != null)
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

            return rowsAffected > 0;
        }

        public async Task<bool> DeleteTeacherAsync(int id)
        {
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageTeacher 'DELETE', {id}"
            );
            return rowsAffected > 0;
        }

        public async Task<bool> SavePhotoPathAsync(int id, string path)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return false;

            teacher.ProfilePhotoPath = path;
            teacher.ModifiedOn = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
