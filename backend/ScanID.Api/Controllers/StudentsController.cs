using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
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
    /// Controller for managing student records.
    /// This implementation adheres to SOLID Principles and is fully decoupled utilizing DI.
    /// - High-level module (StudentsController) does not depend on low-level database schemas, but on the abstraction (IStudentService).
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IWebHostEnvironment _environment;

        public StudentsController(IStudentService studentService, IWebHostEnvironment environment)
        {
            _studentService = studentService;
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
            var students = await _studentService.GetStudentsAsync(schoolId, academicYearId);
            return Ok(students);
        }

        /// <summary>
        /// Retrieves a specific student by ID.
        /// </summary>
        /// <param name="id">The student ID.</param>
        /// <returns>The requested student record.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        /// <summary>
        /// Registers a new student.
        /// </summary>
        /// <param name="student">The student data.</param>
        /// <returns>The created student record.</returns>
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            var createdStudent = await _studentService.CreateStudentAsync(student);
            return CreatedAtAction("GetStudent", new { id = createdStudent.Id }, createdStudent);
        }

        /// <summary>
        /// Exports student records to a CSV file.
        /// </summary>
        /// <param name="schoolId">Filter by school filter.</param>
        /// <returns>A downloadable CSV file.</returns>
        [HttpGet("export")]
        public async Task<IActionResult> ExportStudents(int? schoolId)
        {
            var students = await _studentService.GetStudentsForExportAsync(schoolId);

            var csv = new System.Text.StringBuilder();
            // Comprehensive Header
            csv.AppendLine("RegistrationNumber,Name,Standard,Section,AcademicYear,RollNumber,GRNO,Gender,DOB,Category,Religion,Caste,Status,Mobile,Email,Address,MotherName,AadharCard,RFID,Shift,BloodGroup,House,AdmissionDate,FatherName,NationalId,BankAcc,ProfilePhotoPath");

            foreach (var s in students)
            {
                var row = new List<string?>
                {
                    s.RegistrationNumber,
                    s.Name,
                    s.Standard?.Name,
                    s.Section?.Name,
                    s.AcademicYear?.Name,
                    s.RollNumber.ToString(),
                    s.GRNO,
                    s.GENDER,
                    s.DOB,
                    s.Category?.Name,
                    s.Religion?.Name,
                    s.Caste?.Name,
                    s.Status,
                    s.MOBILE,
                    s.EMAIL,
                    $"\"{s.ADDRESS?.Replace("\"", "\"\"")}\"",
                    s.MOTHERNAME,
                    s.aadharcard,
                    s.RFID,
                    s.Shift?.Name,
                    s.BloodGroup?.Name,
                    s.House?.Name,
                    s.DOA,
                    s.FATHERNAME,
                    s.PEN_No,
                    s.bankacc,
                    s.ProfilePhotoPath
                };
                csv.AppendLine(string.Join(",", row));
            }

            return File(System.Text.Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", $"Students_Export_{DateTime.Now:yyyyMMdd}.csv");
        }

        /// <summary>
        /// Generates a comprehensive sample CSV template for bulk student upload.
        /// </summary>
        [HttpGet("sample-template")]
        public IActionResult GetSampleTemplate()
        {
            var csv = new System.Text.StringBuilder();
            // Required Header reflecting all critical table fields
            csv.AppendLine("RegistrationNumber,Name,SchoolId,StandardId,SectionId,AcademicYearId,RollNumber,GRNO,Gender,DOB,CategoryId,ReligionId,CasteId,Mobile,Email,Address,MotherName,AadharCard,RFID,ShiftId,BloodGroupId,HouseId,DOA,FatherName,PEN_No,BankAcc,ProfilePhotoPath");
            // Example data row
            csv.AppendLine("REG001,John Doe,1,1,1,1,10,1234,Male,2015-05-15,1,1,1,9876543210,john@example.com,City Main Road,Jane Doe,123456789012,RF-123,1,1,1,2024-06-01,Robert Doe,PEN123,ACC12345,/photos/1/example.jpg");

            return File(System.Text.Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "Student_Upload_Template.csv");
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

            try
            {
                var success = await _studentService.UpdateStudentAsync(student);
                if (!success)
                {
                    if (!await StudentExistsAsync(id)) return NotFound();
                    return StatusCode(500, "Failed to persist student record updates.");
                }
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
        /// Encapsulates validations inside Domain logic.
        /// </summary>
        /// <param name="students">List of students.</param>
        /// <returns>Count of registered students.</returns>
        [HttpPost("bulk")]
        public async Task<ActionResult<object>> PostBulkStudents(IEnumerable<Student> students)
        {
            if (students == null || !students.Any()) return BadRequest("No student data provided.");

            try
            {
                var response = await _studentService.CreateBulkStudentsAsync(students);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Removes a student record (soft delete handled by service).
        /// </summary>
        /// <param name="id">The student ID to delete.</param>
        /// <returns>No content on success.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var success = await _studentService.DeleteStudentAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }

        /// <summary>
        /// Updates a student's profile picture by saving it to the server filesystem.
        /// </summary>
        /// <param name="id">The student ID.</param>
        /// <param name="file">The uploaded image file.</param>
        /// <returns>JSON object containing the saved relative path.</returns>
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> UploadPhoto(int id, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                var contentType = Request.ContentType ?? "null";
                var bodyLength = Request.ContentLength ?? 0;
                return BadRequest(new { 
                    message = "No image file provided for upload.",
                    details = $"Received Content-Type: {contentType}, Body Length: {bodyLength}. Ensure form key is 'file' and boundary is set.",
                    id = id
                });
            }

            var student = await _studentService.GetStudentWithPhotoDetailsAsync(id);

            if (student == null)
            {
                return NotFound(new { message = "Student record not found." });
            }

            try
            {
                var schoolID = SanitizeFolderName(student.School?.Id.ToString() ?? student.SchoolId.ToString());
                var relativeFolder = Path.Combine("photos", schoolID);

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
                if (string.IsNullOrEmpty(extension)) extension = ".jpg";
                
                Random res = new Random();
                string random12Digit = "";
                for (int i = 0; i < 12; i++)
                {
                    random12Digit += res.Next(0, 10).ToString();
                }

                var fileName = $"{random12Digit}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = $"/photos/{schoolID}/{fileName}";

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

                await _studentService.SaveChangesAsync();

                return Ok(new
                {
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

            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = new string(name.Select(ch => invalidChars.Contains(ch) ? '_' : ch).ToArray());

            return sanitized.Replace(" ", "_").Trim('_');
        }

        private async Task<bool> StudentExistsAsync(int id)
        {
            var std = await _studentService.GetStudentByIdAsync(id);
            return std != null;
        }
    }
}
