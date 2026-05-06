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

            var existingStudent = await _context.Students.FindAsync(id);
            if (existingStudent == null) return NotFound();

            existingStudent.RegistrationNumber = student.RegistrationNumber;
            existingStudent.FirstName = student.FirstName;
            existingStudent.MiddleName = student.MiddleName;
            existingStudent.LastName = student.LastName;
            existingStudent.FullName = student.FullName;
            existingStudent.DateOfBirth = student.DateOfBirth;
            existingStudent.Standard = student.Standard;
            existingStudent.Section = student.Section;
            existingStudent.RollNumber = student.RollNumber;
            existingStudent.Address = student.Address;
            existingStudent.Gender = student.Gender;
            existingStudent.ContactNumber = student.ContactNumber;
            existingStudent.MotherName = student.MotherName;
            existingStudent.AadharCard = student.AadharCard;
            existingStudent.Photo = student.Photo;
            existingStudent.SchoolId = student.SchoolId;

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
