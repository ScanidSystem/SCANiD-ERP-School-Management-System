using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScanID.Api.Models
{
    /// <summary>
    /// Base class for all entities with audit fields.
    /// </summary>
    public abstract class BaseEntity
    {
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public string? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public string? ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Model for tracking data changes.
    /// </summary>
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Type { get; set; }
        public string? TableName { get; set; }
        public DateTime DateTime { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? AffectedColumns { get; set; }
        public string? PrimaryKey { get; set; }
    }

    /// <summary>
    /// Model for structured error logging in the database.
    /// </summary>
    public class ErrorLog
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public string? Level { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Exception { get; set; }
        public string? Properties { get; set; }
    }

    /// <summary>
    /// Represents a school registration.
    /// </summary>
    public class School : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int TotalStudents { get; set; }
        public string Status { get; set; } = "Active";
    }

    /// <summary>
    /// Represents a system user.
    /// </summary>
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string Role { get; set; } = "student";
        public int? SchoolId { get; set; }
        [ForeignKey("SchoolId")]
        public School? School { get; set; }
    }

    /// <summary>
    /// Represents a student record.
    /// </summary>
    public class Student : BaseEntity
    {
        public int Id { get; set; }
        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        [Required]
        public string FullName { get; set; } = string.Empty;
        public int SchoolId { get; set; }
        public string? Standard { get; set; }
        public string? Section { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? FatherName { get; set; }
        public string? MotherName { get; set; }
        public string? ContactNumber { get; set; }
        public string? Address { get; set; }
        public string? AadharCard { get; set; }
        public string? Photo { get; set; }
        public string Status { get; set; } = "Active";
        public int RollNumber { get; set; }

        [ForeignKey("SchoolId")]
        public School? School { get; set; }
    }


    /// <summary>
    /// Tracks student attendance.
    /// </summary>
    public class Attendance : BaseEntity
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Present";
        public int MarkedByUserId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }

    /// <summary>
    /// Manages student fees.
    /// </summary>
    public class Fee : BaseEntity
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string Type { get; set; } = "Tuition";
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string Status { get; set; } = "Pending";
        public string? PaymentMethod { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }

    /// <summary>
    /// Tracks student academic marks.
    /// </summary>
    public class Mark : BaseEntity
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string ExamName { get; set; } = "Mid-Term";
        public decimal MarksObtained { get; set; }
        public decimal TotalMarks { get; set; }
        public string? Grade { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }

    /// <summary>
    /// Represents a teacher record.
    /// </summary>
    public class Teacher : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SchoolId { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Qualification { get; set; }
        public string? ContactNumber { get; set; }
        public string Status { get; set; } = "Active";

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("SchoolId")]
        public School? School { get; set; }
    }

    /// <summary>
    /// Manages system messages and alerts.
    /// </summary>
    public class Message : BaseEntity
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? ReceiverId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public string Type { get; set; } = "Alert";
    }
}

