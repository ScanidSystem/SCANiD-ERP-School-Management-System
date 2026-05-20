using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student fee records.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves fee records, optionally filtered by student, school, or academic year.
        /// </summary>
        /// <param name="studentId">Optional student filter.</param>
        /// <param name="schoolId">Optional school filter.</param>
        /// <param name="academicYearId">Optional academic year filter.</param>
        /// <returns>A list of fee entries.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fee>>> GetFees(int? studentId, int? schoolId, int? academicYearId)
        {
            var query = _context.Fees.Include(f => f.Student).AsNoTracking().AsQueryable();
            
            if (studentId.HasValue)
                query = query.Where(f => f.StudentId == studentId.Value);
            
            if (schoolId.HasValue)
                query = query.Where(f => f.Student!.SchoolId == schoolId.Value);

            if (academicYearId.HasValue)
                query = query.Where(f => f.Student!.AcademicYearId == academicYearId.Value);

            return await query.ToListAsync();
        }

        /// <summary>
        /// Records a new fee entry or payment.
        /// </summary>
        /// <param name="fee">The fee details.</param>
        /// <returns>The created fee record.</returns>
        [HttpPost]
        public async Task<ActionResult<Fee>> PostFee(Fee fee)
        {
            _context.Fees.Add(fee);
            await _context.SaveChangesAsync();
            return Ok(fee);
        }
    }

}
