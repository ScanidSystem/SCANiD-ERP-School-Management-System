using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Services
{
    /// <summary>
    /// Decoupled MarkService realization calling stored procedures.
    /// Provides outstanding performance and decoupled architecture.
    /// </summary>
    public class MarkService : IMarkService
    {
        private readonly ApplicationDbContext _context;

        public MarkService(ApplicationDbContext context)
        {
            _context = context;
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
            // Execute the sp_ManageMark stored procedure using SQL Server parameters.
            // Our advanced dual-mode stored procedure sp_ManageMark handles name mapping 
            // of subject and exam fields and generates corresponding grades dynamically.
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageMark 'INSERT', NULL, {mark.StudentId}, {mark.Subject}, {mark.TotalMarks}, {mark.MarksObtained}, {mark.Grade}, NULL"
            );
            return rowsAffected > 0;
        }
    }
}
