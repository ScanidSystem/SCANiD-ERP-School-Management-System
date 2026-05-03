using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendance(DateTime date, int? schoolId)
        {
            var query = _context.Attendance.Include(a => a.Student).AsQueryable();
            
            if (schoolId.HasValue)
            {
                query = query.Where(a => a.Student!.SchoolId == schoolId.Value);
            }

            return await query.Where(a => a.Date.Date == date.Date).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendance(Attendance attendance)
        {
            _context.Attendance.Add(attendance);
            await _context.SaveChangesAsync();
            return Ok(attendance);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> PostBulkAttendance(List<Attendance> records)
        {
            _context.Attendance.AddRange(records);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
