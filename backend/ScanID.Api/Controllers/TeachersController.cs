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
        /// Projects teacher entities to API DTOs and prevents nested PasswordHash fields from being serialized.
        /// </summary>
        private static TeacherDto ToDto(Teacher teacher) => new()
        {
            Id = teacher.Id,
            UserId = teacher.UserId,
            SchoolId = teacher.SchoolId,
            EmployeeId = teacher.EmployeeId,
            Department = teacher.Department,
            Qualification = teacher.Qualification,
            ContactNumber = teacher.ContactNumber,
            Status = teacher.Status,
            ProfilePhotoPath = teacher.ProfilePhotoPath,
            Experience = teacher.Experience,
            Subject = teacher.Subject,
            StandardId = teacher.StandardId,
            SectionId = teacher.SectionId,
            User = teacher.User == null ? null : new UserDto
            {
                Id = teacher.User.Id,
                Username = teacher.User.Username,
                Name = teacher.User.Name,
                Email = teacher.User.Email,
                Role = teacher.User.Role,
                RoleId = teacher.User.RoleId,
                SchoolId = teacher.User.SchoolId,
                IsActive = teacher.User.IsActive,
                CreatedOn = teacher.User.CreatedOn,
                ModifiedOn = teacher.User.ModifiedOn
            }
        };

        /// <summary>
        /// Converts a write DTO into the existing domain entity expected by the service layer.
        /// The controller owns this mapping to avoid binding full EF entities from the request body.
        /// </summary>
        private static Teacher ToEntity(TeacherWriteDto dto, int id = 0) => new()
        {
            Id = id,
            UserId = dto.UserId,
            SchoolId = dto.SchoolId,
            EmployeeId = dto.EmployeeId,
            Department = dto.Department,
            Qualification = dto.Qualification,
            ContactNumber = dto.ContactNumber,
            Status = dto.Status,
            ProfilePhotoPath = dto.ProfilePhotoPath,
            Experience = dto.Experience,
            Subject = dto.Subject,
            StandardId = dto.StandardId,
            SectionId = dto.SectionId,
            CreatedBy = dto.CreatedBy,
            ModifiedBy = dto.ModifiedBy,
            User = dto.User == null ? null : new User
            {
                Username = dto.User.Username,
                PasswordHash = dto.User.PasswordHash ?? string.Empty,
                Name = dto.User.Name,
                Email = dto.User.Email,
                Role = dto.User.Role,
                RoleId = dto.User.RoleId,
                SchoolId = dto.User.SchoolId
            }
        };

        /// <summary>
        /// Retrieves a paged list of teachers, optionally sorted and filtered via stored procedures.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetTeachers(
            [FromQuery] int? schoolId,
            [FromQuery] int? academicYearId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = null,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? subject = null)
        {
            var (paginatedTeachers, totalCount) = await _teacherService.GetTeachersPagedAsync(
                schoolId,
                academicYearId,
                page,
                pageSize,
                sortBy,
                sortOrder,
                search,
                status,
                subject
            );

            var totalPages = (int)Math.Max(1, Math.Ceiling((double)totalCount / pageSize));
            var currentPage = Math.Max(1, page);

            return Ok(new
            {
                data = paginatedTeachers.Select(ToDto),
                pagination = new
                {
                    totalCount,
                    totalPages,
                    page = currentPage,
                    pageSize
                }
            });
        }

        /// <summary>
        /// Registers a new teacher in the system.
        /// </summary>
        /// <param name="teacher">The teacher registration data.</param>
        /// <returns>The created teacher record.</returns>
        [HttpPost]
        public async Task<ActionResult<TeacherDto>> PostTeacher(TeacherWriteDto request)
        {
            var teacher = ToEntity(request);
            var createdTeacher = await _teacherService.CreateTeacherAsync(teacher);
            return Ok(ToDto(createdTeacher));
        }

        /// <summary>
        /// Updates a teacher's professional information and linked user account.
        /// </summary>
        /// <param name="id">The teacher ID.</param>
        /// <param name="teacher">The updated teacher data.</param>
        /// <returns>No content on success.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, TeacherWriteDto request)
        {
            var existingTeacher = await _teacherService.GetTeacherByIdAsync(id);
            if (existingTeacher == null) return NotFound();

            var teacher = ToEntity(request, id);
            if (teacher.UserId <= 0)
            {
                teacher.UserId = existingTeacher.UserId;
            }

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
