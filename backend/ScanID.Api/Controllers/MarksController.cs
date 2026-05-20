using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student marks and academic performance.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MarksController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves marks records, optionally filtered by student, school, or academic year.
        /// </summary>
        /// <param name="studentId">Optional student filter.</param>
        /// <param name="schoolId">Optional school filter.</param>
        /// <param name="academicYearId">Optional academic year filter.</param>
        /// <returns>A list of marks records.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks(int? studentId, int? schoolId, int? academicYearId)
        {
            var query = _context.Marks.Include(m => m.Student).AsNoTracking().AsQueryable();
            
            if (studentId.HasValue)
                query = query.Where(m => m.StudentId == studentId.Value);
            
            if (schoolId.HasValue)
                query = query.Where(m => m.Student!.SchoolId == schoolId.Value);

            if (academicYearId.HasValue)
                query = query.Where(m => m.Student!.AcademicYearId == academicYearId.Value);

            return await query.ToListAsync();
        }

        /// <summary>
        /// Records new marks for a student.
        /// </summary>
        /// <param name="mark">The mark entry details.</param>
        /// <returns>The created mark record.</returns>
        [HttpPost]
        public async Task<ActionResult<Mark>> PostMark(Mark mark)
        {
            _context.Marks.Add(mark);
            await _context.SaveChangesAsync();
            return Ok(mark);
        }
    }

}
