using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchoolsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SchoolsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<School>>> GetSchools()
        {
            return await _context.Schools.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<School>> GetSchool(int id)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return NotFound();
            return school;
        }

        [HttpPost]
        public async Task<ActionResult<School>> PostSchool(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSchool", new { id = school.Id }, school);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchool(int id, School school)
        {
            if (id != school.Id) return BadRequest();
            _context.Entry(school).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
