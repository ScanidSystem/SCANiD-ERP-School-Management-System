using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fee>>> GetFees(int? studentId, int? schoolId)
        {
            var query = _context.Fees.Include(f => f.Student).AsQueryable();
            
            if (studentId.HasValue)
                query = query.Where(f => f.StudentId == studentId.Value);
            
            if (schoolId.HasValue)
                query = query.Where(f => f.Student!.SchoolId == schoolId.Value);

            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Fee>> PostFee(Fee fee)
        {
            _context.Fees.Add(fee);
            await _context.SaveChangesAsync();
            return Ok(fee);
        }
    }
}
