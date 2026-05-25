using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Teacher Registry operations.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface ITeacherService
    {
        Task<IEnumerable<Teacher>> GetTeachersAsync(int? schoolId);
        Task<Teacher?> GetTeacherByIdAsync(int id);
        Task<Teacher> CreateTeacherAsync(Teacher teacher);
        Task<bool> UpdateTeacherAsync(Teacher teacher);
        Task<bool> DeleteTeacherAsync(int id);
        Task<bool> SavePhotoPathAsync(int id, string path);
    }
}
