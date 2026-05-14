using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student records.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves students for a specific school.
        /// </summary>
        /// <param name="schoolId">Optional school ID filter.</param>
        /// <returns>A list of students.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents(int? schoolId)
        {
            var query = _context.Students.AsNoTracking().AsQueryable();
            
            if (schoolId.HasValue)
            {
                query = query.Where(s => s.SchoolId == schoolId.Value);
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific student by ID.
        /// </summary>
        /// <param name="id">The student ID.</param>
        /// <returns>The requested student record.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        /// <summary>
        /// Registers a new student.
        /// </summary>
        /// <param name="student">The student data.</param>
        /// <returns>The created student record.</returns>
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        /// <summary>
        /// Updates a student's personal and academic details.
        /// </summary>
        /// <param name="id">The ID of the student to update.</param>
        /// <param name="student">The updated student data.</param>
        /// <returns>No content on success.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.Id) return BadRequest();

            _context.Entry(student).State = EntityState.Modified;
            
            // Ensure auditing and non-schema fields are preserved if not sent
            // or just let EF handle it. Here we use Entry(student).State = Modified.
            // But we should ensure we don't accidentally overwrite IsDeleted etc if not in payload.
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await StudentExistsAsync(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        /// <summary>
        /// Bulk registers multiple students.
        /// </summary>
        /// <param name="students">List of students.</param>
        /// <returns>Count of registered students.</returns>
        [HttpPost("bulk")]
        public async Task<ActionResult<object>> PostBulkStudents(IEnumerable<Student> students)
        {
            if (students == null || !students.Any()) return BadRequest("No student data provided.");

            _context.Students.AddRange(students);
            await _context.SaveChangesAsync();

            return Ok(new { count = students.Count(), message = "Bulk upload successful" });
        }

        /// <summary>
        /// Removes a student record (soft delete handled by context).
        /// </summary>
        /// <param name="id">The student ID to delete.</param>
        /// <returns>No content on success.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            // Set IsDeleted for soft delete
            student.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private async Task<bool> StudentExistsAsync(int id)
        {
            return await _context.Students.AnyAsync(e => e.Id == id);
        }
    }
}
