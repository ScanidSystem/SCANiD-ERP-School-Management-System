using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;
using ScanID.Api.Utilities;

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
        private readonly IWebHostEnvironment _environment;

        public StudentsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        /// <summary>
        /// Retrieves students for a specific school and optionally an academic year.
        /// </summary>
        /// <param name="schoolId">Optional school ID filter.</param>
        /// <param name="academicYearId">Optional academic year ID filter.</param>
        /// <returns>A list of students.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents(int? schoolId, int? academicYearId)
        {
            IQueryable<Student> query = _context.Students
                .Include(s => s.Standard)
                .Include(s => s.Section)
                .Include(s => s.AcademicYear)
                .Where(s => !s.IsDeleted)
                .AsNoTracking();
            
            if (schoolId.HasValue)
            {
                query = query.Where(s => s.SchoolId == schoolId.Value);
            }

            if (academicYearId.HasValue)
            {
                // To support both the modern ID-based link and the legacy string-based year name (e.g., "2025-2026")
                // we first find the year name associated with the provided ID.
                var academicYear = await _context.AcademicYears.FindAsync(academicYearId.Value);
                if (academicYear != null)
                {
                    var yearName = academicYear.Name;
                    query = query.Where(s => 
                        s.AcademicYearId == academicYearId.Value || 
                        s.academicyear == academicYearId.Value.ToString() ||
                        s.academicyear == yearName);
                }
                else
                {
                    query = query.Where(s => 
                        s.AcademicYearId == academicYearId.Value || 
                        s.academicyear == academicYearId.Value.ToString());
                }
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


        /// <summary>
        /// Updates a student's profile picture by saving it to the server filesystem.
        /// </summary>
        /// <param name="id">The student ID.</param>
        /// <param name="file">The uploaded image file.</param>
        /// <returns>JSON object containing the saved relative path.</returns>
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
        {
            if (file == null || file.Length == 0) 
            {
                return BadRequest(new { message = "No image file provided for upload." });
            }

            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Standard)
                .Include(s => s.Section)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null) 
            {
                return NotFound(new { message = "Student record not found." });
            }

            try 
            {
                var schoolName = SanitizeFolderName(student.School?.Name ?? "General");
                var standardName = SanitizeFolderName(student.Standard?.Name ?? student.STD ?? "Unassigned");
                var divisionName = SanitizeFolderName(student.Section?.Name ?? student.DIV ?? "General");

                var relativeFolder = Path.Combine("uploads", "students", schoolName, standardName, divisionName);
                
                // Enhanced path resolution for robust folder creation across different environments
                string webRootPath = _environment.WebRootPath;
                if (string.IsNullOrEmpty(webRootPath))
                {
                    // Fallback 1: Try to find wwwroot in current directory
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                
                // Fallback 2: If we are in a subfolder or different context, ensure we have a base
                if (!Directory.Exists(webRootPath))
                {
                    Directory.CreateDirectory(webRootPath);
                }

                var uploadsFolder = Path.Combine(webRootPath, relativeFolder);
                
                // Ensure the hierarchical directory structure exists
                if (!Directory.Exists(uploadsFolder)) 
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(file.FileName);
                var fileName = $"student_{id}_{DateTime.Now.Ticks}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Path for storage in DB and serving to frontend
                var relativePath = $"/{relativeFolder.Replace("\\", "/")}/{fileName}";

                if (!string.IsNullOrEmpty(student.ProfilePhotoPath))
                {
                    var oldFilePath = Path.Combine(webRootPath, student.ProfilePhotoPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        try { System.IO.File.Delete(oldFilePath); } catch { /* ignore if fail */ }
                    }
                }

                student.ProfilePhotoPath = relativePath;
                student.ModifiedOn = DateTime.Now;
                
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Identity image updated successfully", 
                    path = student.ProfilePhotoPath 
                });
            }
            catch (Exception ex)
            {
                FileLogger.LogError(ex);
                return StatusCode(500, new { message = "Physical storage failed: " + ex.Message });
            }
        }

        /// <summary>
        /// Sanitizes a string for use as a folder name by removing illegal characters.
        /// </summary>
        private string SanitizeFolderName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return "Unassigned";
            
            // Remove illegal characters from path
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = new string(name.Select(ch => invalidChars.Contains(ch) ? '_' : ch).ToArray());
            
            // Further cleaning to ensure it's a slick folder name
            return sanitized.Replace(" ", "_").Trim('_');
        }

        private async Task<bool> StudentExistsAsync(int id)
        {
            return await _context.Students.AnyAsync(e => e.Id == id);
        }
    }
}
