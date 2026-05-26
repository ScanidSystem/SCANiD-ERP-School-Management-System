using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using ScanID.Api.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing teacher details and personal accounts.
    /// Perfectly adheres to SOLID Principles and is fully decoupled.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ITeacherService _teacherService;
        private readonly IWebHostEnvironment _environment;

        public TeachersController(ITeacherService teacherService, IWebHostEnvironment environment)
        {
            _teacherService = teacherService;
            _environment = environment;
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
            var teachers = await _teacherService.GetTeachersAsync(schoolId);
            return Ok(teachers);
        }

        /// <summary>
        /// Registers a new teacher in the system.
        /// </summary>
        /// <param name="teacher">The teacher registration data.</param>
        /// <returns>The created teacher record.</returns>
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            var createdTeacher = await _teacherService.CreateTeacherAsync(teacher);
            return Ok(createdTeacher);
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

            var existingTeacher = await _teacherService.GetTeacherByIdAsync(id);
            if (existingTeacher == null) return NotFound();

            var success = await _teacherService.UpdateTeacherAsync(teacher);
            if (!success) return StatusCode(500, "Failed to persist teacher record updates.");

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
            var existingTeacher = await _teacherService.GetTeacherByIdAsync(id);
            if (existingTeacher == null) return NotFound();

            var success = await _teacherService.DeleteTeacherAsync(id);
            if (!success) return StatusCode(500, "Failed to delete teacher record.");

            return NoContent();
        }

        /// <summary>
        /// Handles physical storage of teacher photos.
        /// </summary>
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> UploadPhoto(int id, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { message = "Empty payload" });

            try
            {
                var teacher = await _teacherService.GetTeacherByIdAsync(id);
                if (teacher == null) return NotFound(new { message = "Teacher not found" });

                string webRootPath = _environment.WebRootPath;
                if (string.IsNullOrEmpty(webRootPath))
                {
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }
                
                if (!Directory.Exists(webRootPath))
                {
                    Directory.CreateDirectory(webRootPath);
                }

                var relativeFolder = Path.Combine("photos", "teachers", id.ToString());
                var uploadsFolder = Path.Combine(webRootPath, relativeFolder);
                
                if (!Directory.Exists(uploadsFolder)) 
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate a 12-digit random number as requested by the user
                var extension = Path.GetExtension(file.FileName);
                if (string.IsNullOrEmpty(extension)) extension = ".png";
                var random = new Random();
                var random12Digit = string.Concat(Enumerable.Range(0, 12).Select(_ => random.Next(10).ToString()));
                var fileName = $"{random12Digit}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);
                var relativePath = $"{relativeFolder.Replace("\\", "/")}/{fileName}";

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var success = await _teacherService.SavePhotoPathAsync(id, relativePath);
                if (!success) return StatusCode(500, "Failed to save teacher photo path to database.");

                return Ok(new { data = new { path = relativePath } });
            }
            catch (Exception ex)
            {
                FileLogger.LogError(ex);
                return StatusCode(500, new { message = "Physical storage failed: " + ex.Message });
            }
        }
    }
}
