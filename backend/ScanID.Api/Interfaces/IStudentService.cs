using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Student Management business use cases.
    /// This establishes cohesive system boundaries and decoupled architecture.
    /// </summary>
    public interface IStudentService
    {
        /// <summary>
        /// Retrieves non-deleted students from SQL Server, matching filters.
        /// </summary>
        Task<IEnumerable<Student>> GetStudentsAsync(int? schoolId, int? academicYearId);

        /// <summary>
        /// Retrieves a single student record.
        /// </summary>
        Task<Student?> GetStudentByIdAsync(int id);

        /// <summary>
        /// Registers a single student with auditing properties.
        /// </summary>
        Task<Student> CreateStudentAsync(Student student);

        /// <summary>
        /// Updates an edited student.
        /// </summary>
        Task<bool> UpdateStudentAsync(Student student);

        /// <summary>
        /// Validates unique fields and bulk creates multiple students within a single transaction.
        /// </summary>
        Task<object> CreateBulkStudentsAsync(IEnumerable<Student> students);

        /// <summary>
        /// Soft deletes a student records.
        /// </summary>
        Task<bool> DeleteStudentAsync(int id);

        /// <summary>
        /// Loads student coupled with relationships relevant for photo update logic.
        /// </summary>
        Task<Student?> GetStudentWithPhotoDetailsAsync(int id);

        /// <summary>
        /// Retrieves student records preloaded with all relationship definitions for CSV exporting.
        /// </summary>
        Task<IEnumerable<Student>> GetStudentsForExportAsync(int? schoolId);

        /// <summary>
        /// Commits all entity tracking modifications.
        /// </summary>
        Task<bool> SaveChangesAsync();
    }
}
