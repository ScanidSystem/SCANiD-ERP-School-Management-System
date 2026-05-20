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
                query = query.Where(s => s.AcademicYearId == academicYearId.Value);
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
            // Set audit fields
            student.CreatedOn = DateTime.Now;
            student.ModifiedOn = DateTime.Now;
            student.IsActive = true;
            student.IsDeleted = false;

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        /// <summary>
        /// Exports student records to a CSV file.
        /// </summary>
        /// <param name="schoolId">Filter by school filter.</param>
        /// <returns>A downloadable CSV file.</returns>
        [HttpGet("export")]
        public async Task<IActionResult> ExportStudents(int? schoolId)
        {
            var query = _context.Students
                .Include(s => s.Standard)
                .Include(s => s.Section)
                .Include(s => s.AcademicYear)
                .Include(s => s.Caste)
                .Include(s => s.Religion)
                .Include(s => s.Category)
                .Include(s => s.BloodGroup)
                .Include(s => s.House)
                .Include(s => s.Shift)
                .Where(s => !s.IsDeleted);

            if (schoolId.HasValue)
            {
                query = query.Where(s => s.SchoolId == schoolId.Value);
            }

            var students = await query.ToListAsync();

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

            // Load existing non-deleted student unique identifiers from the database for validation
            var dbStudents = await _context.Students
                .Where(s => !s.IsDeleted)
                .Select(s => new { s.RegistrationNumber, s.GRNO, s.aadharcard, s.RFID, s.uniformid })
                .AsNoTracking()
                .ToListAsync();

            var dbRegs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var dbUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var dbs in dbStudents)
            {
                if (!string.IsNullOrEmpty(dbs.RegistrationNumber)) dbRegs.Add(dbs.RegistrationNumber.Trim());
                if (!string.IsNullOrEmpty(dbs.GRNO)) dbRegs.Add(dbs.GRNO.Trim());
                if (!string.IsNullOrEmpty(dbs.aadharcard)) dbAadhars.Add(dbs.aadharcard.Trim());
                if (!string.IsNullOrEmpty(dbs.RFID)) dbRfids.Add(dbs.RFID.Trim());
                if (!string.IsNullOrEmpty(dbs.uniformid)) dbUniforms.Add(dbs.uniformid.Trim());
            }

            // Keep track of sets within the incoming batch
            var batchRegs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchAadhars = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchRfids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var batchUniforms = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            int index = 1;
            foreach (var student in students)
            {
                // a) RegistrationNumber/GRNO
                var reg = (student.RegistrationNumber ?? student.GRNO ?? "").Trim();
                if (!string.IsNullOrEmpty(reg))
                {
                    if (batchRegs.Contains(reg) || dbRegs.Contains(reg))
                    {
                        return BadRequest(new { message = $"Row {index}: Duplicate Registration Number/GRNO '{reg}' detected." });
                    }
                    batchRegs.Add(reg);
                }

                // If GRNO is passed separately and differs from RegistrationNumber
                var grno = (student.GRNO ?? "").Trim();
                if (!string.IsNullOrEmpty(grno))
                {
                    if (batchRegs.Contains(grno) || dbRegs.Contains(grno))
                    {
                        return BadRequest(new { message = $"Row {index}: Duplicate Registration Number/GRNO '{grno}' detected." });
                    }
                    batchRegs.Add(grno);
                }

                // b) AadharCard
                var aadhar = (student.aadharcard ?? "").Trim();
                if (!string.IsNullOrEmpty(aadhar))
                {
                    if (batchAadhars.Contains(aadhar) || dbAadhars.Contains(aadhar))
                    {
                        return BadRequest(new { message = $"Row {index}: Duplicate Aadhar Card '{aadhar}' detected." });
                    }
                    batchAadhars.Add(aadhar);
                }

                // c) RFID
                var rfid = (student.RFID ?? "").Trim();
                if (!string.IsNullOrEmpty(rfid))
                {
                    if (batchRfids.Contains(rfid) || dbRfids.Contains(rfid))
                    {
                        return BadRequest(new { message = $"Row {index}: Duplicate RFID/CardID '{rfid}' detected." });
                    }
                    batchRfids.Add(rfid);
                }

                // d) UniformID
                var uniform = (student.uniformid ?? "").Trim();
                if (!string.IsNullOrEmpty(uniform))
                {
                    if (batchUniforms.Contains(uniform) || dbUniforms.Contains(uniform))
                    {
                        return BadRequest(new { message = $"Row {index}: Duplicate UniformID '{uniform}' detected." });
                    }
                    batchUniforms.Add(uniform);
                }

                student.CreatedOn = DateTime.Now;
                student.ModifiedOn = DateTime.Now;
                student.IsActive = true;
                student.IsDeleted = false;

                // Ensure RegistrationNumber is set if missing
                if (string.IsNullOrEmpty(student.RegistrationNumber))
                {
                    student.RegistrationNumber = "REG-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
                }

                index++;
            }

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
        public async Task<IActionResult> UploadPhoto(int id, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                // Inspecting the request more closely for diagnostics
                var contentType = Request.ContentType ?? "null";
                var bodyLength = Request.ContentLength ?? 0;
                return BadRequest(new { 
                    message = "No image file provided for upload.",
                    details = $"Received Content-Type: {contentType}, Body Length: {bodyLength}. Ensure form key is 'file' and boundary is set.",
                    id = id
                });
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
                var schoolID = SanitizeFolderName(student.School?.Id.ToString() ?? student.SchoolId.ToString());
                var relativeFolder = Path.Combine("photos", schoolID);

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
                if (string.IsNullOrEmpty(extension)) extension = ".jpg";
                
                // Generate a 12-digit random number for the filename as requested
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

                // Path for storage in DB and serving to frontend
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

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Identity image updated successfully",
                    path = student.ProfilePhotoPath
                });
            }
            catch (Exception ex)
            {
                ScanID.Api.Utilities.FileLogger.LogError(ex);
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
