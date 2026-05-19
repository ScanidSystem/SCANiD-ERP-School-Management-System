using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student attendance.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves attendance records for a specific date, optional school, and optional academic year.
        /// </summary>
        /// <param name="date">The date of attendance.</param>
        /// <param name="schoolId">Optional school filter.</param>
        /// <param name="academicYearId">Optional academic year filter.</param>
        /// <returns>A list of attendance records.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendance(DateTime date, int? schoolId, int? academicYearId)
        {
            var query = _context.Attendance.Include(a => a.Student).AsNoTracking().AsQueryable();
            
            if (schoolId.HasValue)
            {
                query = query.Where(a => a.Student!.SchoolId == schoolId.Value);
            }

            if (academicYearId.HasValue)
            {
                query = query.Where(a => a.Student!.AcademicYearId == academicYearId.Value);
            }

            return await query.Where(a => a.Date.Date == date.Date).ToListAsync();
        }

        /// <summary>
        /// Submits a single attendance record.
        /// </summary>
        /// <param name="attendance">The attendance data.</param>
        /// <returns>The created record.</returns>
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance)
        {
            _context.Attendance.Add(attendance);
            await _context.SaveChangesAsync();
            return Ok(attendance);
        }

        /// <summary>
        /// Submits multiple attendance records in a single request.
        /// </summary>
        /// <param name="records">List of attendance records.</param>
        /// <returns>Success response.</returns>
        [HttpPost("bulk")]
        public async Task<IActionResult> PostBulkAttendance(List<Attendance> records)
        {
            _context.Attendance.AddRange(records);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

}
