using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing teacher details and personal accounts.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of teachers, optionally filtered by school and academic year.
        /// </summary>
        /// <param name="schoolId">The school ID (optional).</param>
        /// <param name="academicYearId">The academic year ID (optional).</param>
        /// <returns>A list of teachers with their linked user profiles.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers(int? schoolId, int? academicYearId)
        {
            var query = _context.Teachers.Include(t => t.User).AsNoTracking().AsQueryable();
            if (schoolId.HasValue) query = query.Where(t => t.SchoolId == schoolId.Value);
            
            // Note: In some schemas, teachers are linked to academic years via classes or assignments.
            // If the model is extended with such links, add the filter here.
            
            return await query.ToListAsync();
        }

        /// <summary>
        /// Registers a new teacher in the system.
        /// </summary>
        /// <param name="teacher">The teacher registration data.</param>
        /// <returns>The created teacher record.</returns>
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();
            return Ok(teacher);
        }

        /// <summary>
        /// Updates a teacher's professional information and linked user account.
        /// </summary>
        /// <param name="id">The teacher ID.</param>
        /// <param name="teacher">The updated teacher data.</param>
        /// <returns>No content on success.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            if (id != teacher.Id) return BadRequest();

            var existingTeacher = await _context.Teachers.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
            if (existingTeacher == null) return NotFound();

            existingTeacher.ContactNumber = teacher.ContactNumber;
            existingTeacher.Department = teacher.Department;
            existingTeacher.Qualification = teacher.Qualification;
            existingTeacher.Status = teacher.Status;
            existingTeacher.SchoolId = teacher.SchoolId;

            if (teacher.User != null && existingTeacher.User != null)
            {
                existingTeacher.User.Name = teacher.User.Name;
                existingTeacher.User.Email = teacher.User.Email;
            }

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

        /// <summary>
        /// Soft deletes a teacher record and their associated user account.
        /// </summary>
        /// <param name="id">The teacher ID to delete.</param>
        /// <returns>No content on success.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
            if (teacher == null) return NotFound();

            // Soft delete
            teacher.IsDeleted = true;
            if (teacher.User != null)
            {
                teacher.User.IsDeleted = true;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
