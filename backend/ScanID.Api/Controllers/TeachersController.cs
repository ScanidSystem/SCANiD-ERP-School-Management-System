using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers(int? schoolId)
        {
            var query = _context.Teachers.Include(t => t.User).AsQueryable();
            if (schoolId.HasValue) query = query.Where(t => t.SchoolId == schoolId.Value);
            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();
            return Ok(teacher);
        }
    }
}
