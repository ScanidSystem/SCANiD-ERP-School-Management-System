using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScanID.Api.Models
{
    public class School
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int TotalStudents { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class User
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

    public class Student
    {
        public int Id { get; set; }
        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        public int SchoolId { get; set; }
        public string? Standard { get; set; }
        public string? Section { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? FatherName { get; set; }
        public string? ContactNumber { get; set; }
        public string Status { get; set; } = "Active";
        public int RollNumber { get; set; }

        [ForeignKey("SchoolId")]
        public School? School { get; set; }
    }

    public class Attendance
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Present";
        public int MarkedByUserId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }

    public class Fee
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

    public class Mark
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

    public class Teacher
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

    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? ReceiverId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public string Type { get; set; } = "Alert";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
