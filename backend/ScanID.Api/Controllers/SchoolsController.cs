using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;
using ScanID.Api.Utilities;

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
        private readonly IWebHostEnvironment _environment;

        public SchoolsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
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
            existingSchool.ProfilePhotoPath = school.ProfilePhotoPath;

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
        /// Updates a school's identity image (logo) by saving it to the server filesystem.
        /// </summary>
        /// <param name="id">The school ID.</param>
        /// <param name="file">The uploaded image file.</param>
        /// <returns>JSON object containing the saved relative path.</returns>
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
        {
            if (file == null || file.Length == 0) 
            {
                return BadRequest(new { message = "No image file provided for upload." });
            }

            var school = await _context.Schools.FindAsync(id);
            if (school == null) 
            {
                return NotFound(new { message = "School record not found." });
            }

            try 
            {
                var schoolSnapshotName = SanitizeFolderName(school.Name);
                var relativeFolder = Path.Combine("uploads", "schools", schoolSnapshotName);
                
                // Enhanced path resolution for robust folder creation
                string webRootPath = _environment.WebRootPath;
                if (string.IsNullOrEmpty(webRootPath))
                {
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                
                if (!Directory.Exists(webRootPath))
                {
                    Directory.CreateDirectory(webRootPath);
                }

                var uploadsFolder = Path.Combine(webRootPath, relativeFolder);
                
                if (!Directory.Exists(uploadsFolder)) 
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var extension = Path.GetExtension(file.FileName);
                var fileName = $"school_{id}_{DateTime.Now.Ticks}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Path for storage in DB and serving to frontend
                var relativePath = $"/{relativeFolder.Replace("\\", "/")}/{fileName}";

                if (!string.IsNullOrEmpty(school.ProfilePhotoPath))
                {
                    var oldFilePath = Path.Combine(webRootPath, school.ProfilePhotoPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        try { System.IO.File.Delete(oldFilePath); } catch { /* ignore */ }
                    }
                }

                school.ProfilePhotoPath = relativePath;
                school.ModifiedOn = DateTime.Now;
                
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "School identity image updated successfully", 
                    path = school.ProfilePhotoPath 
                });
            }
            catch (Exception ex)
            {
                FileLogger.LogError(ex);
                return StatusCode(500, new { message = "Physical storage failed: " + ex.Message });
            }
        }

        private string SanitizeFolderName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return "Unassigned";
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = new string(name.Select(ch => invalidChars.Contains(ch) ? '_' : ch).ToArray());
            return sanitized.Replace(" ", "_").Trim('_');
        }
    }

}
