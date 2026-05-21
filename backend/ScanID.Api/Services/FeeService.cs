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
    /// Decoupled FeeService realization calling stored procedures.
    /// Provides outstanding performance and decoupled architecture.
    /// </summary>
    public class FeeService : IFeeService
    {
        private readonly ApplicationDbContext _context;

        public FeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Fee>> GetFeesAsync(int? studentId, int? schoolId, int? academicYearId)
        {
            // Core optimization: Execute sp_GetFees containing high-speed SQL joins
            // and map relationships in-memory using DbMapper. This completely avoids Slow Include operations.
            return await DbMapper.ExecuteStoredProcedureAsync<Fee>(
                _context,
                "dbo.sp_GetFees",
                ("StudentId", studentId),
                ("SchoolId", schoolId),
                ("AcademicYearId", academicYearId)
            );
        }

        public async Task<bool> CreateFeeAsync(Fee fee)
        {
            // Execute the sp_ManageFee stored procedure with positional parameters.
            // Under the hood, our optimized dual-mode sp_ManageFee procedure will translate
            // these arguments into the appropriate database insertions on the Fees table.
            var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync(
                $"EXEC dbo.sp_ManageFee 'INSERT', NULL, {fee.StudentId}, {fee.Amount}, {fee.Status}, {fee.PaymentMethod}, NULL"
            );
            return rowsAffected > 0;
        }
    }
}
