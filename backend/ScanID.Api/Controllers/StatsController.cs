using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardStats(int? schoolId)
        {
            var studentQuery = _context.Students.AsQueryable();
            var teacherQuery = _context.Teachers.AsQueryable();
            var attendanceQuery = _context.Attendance.AsQueryable();

            if (schoolId.HasValue)
            {
                studentQuery = studentQuery.Where(s => s.SchoolId == schoolId.Value);
                teacherQuery = teacherQuery.Where(t => t.SchoolId == schoolId.Value);
                attendanceQuery = attendanceQuery.Where(a => a.Student!.SchoolId == schoolId.Value);
            }

            var totalStudents = await studentQuery.CountAsync();
            var totalTeachers = await teacherQuery.CountAsync();
            
            // Simplified stats for demo
            return Ok(new
            {
                totalStudents,
                totalTeachers,
                feeCollection = "$45,200", // Example static for now or join with Fees
                attendanceRate = "92%",
                performanceTrend = "+2.4%"
            });
        }
    }
}
