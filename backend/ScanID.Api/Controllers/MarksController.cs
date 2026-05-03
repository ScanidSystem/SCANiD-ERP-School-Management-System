using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MarksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks(int? studentId, int? schoolId)
        {
            var query = _context.Marks.Include(m => m.Student).AsQueryable();
            
            if (studentId.HasValue)
                query = query.Where(m => m.StudentId == studentId.Value);
            
            if (schoolId.HasValue)
                query = query.Where(m => m.Student!.SchoolId == schoolId.Value);

            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Mark>> PostMark(Mark mark)
        {
            _context.Marks.Add(mark);
            await _context.SaveChangesAsync();
            return Ok(mark);
        }
    }
}
