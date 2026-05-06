using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing school records.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SchoolsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SchoolsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all active schools.
        /// </summary>
        /// <returns>A list of schools.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<School>>> GetSchools()
        {
            return await _context.Schools.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific school by its ID.
        /// </summary>
        /// <param name="id">The school ID.</param>
        /// <returns>The requested school record.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<School>> GetSchool(int id)
        {
            var school = await _context.Schools.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            if (school == null) return NotFound();
            return school;
        }

        /// <summary>
        /// Creates a new school record.
        /// </summary>
        /// <param name="school">The school object.</param>
        /// <returns>The created school record.</returns>
        [HttpPost]
        public async Task<ActionResult<School>> PostSchool(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSchool", new { id = school.Id }, school);
        }

        /// <summary>
        /// Updates an existing school record.
        /// </summary>
        /// <param name="id">The ID of the school to update.</param>
        /// <param name="school">The updated school object.</param>
        /// <returns>No content on success.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchool(int id, School school)
        {
            if (id != school.Id) return BadRequest();

            var existingSchool = await _context.Schools.FindAsync(id);
            if (existingSchool == null) return NotFound();

            existingSchool.Name = school.Name;
            existingSchool.Address = school.Address;
            existingSchool.Phone = school.Phone;
            existingSchool.Email = school.Email;
            existingSchool.Status = school.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
    }

}
