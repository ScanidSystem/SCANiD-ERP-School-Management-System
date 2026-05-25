using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for School Management.
    /// Ensures cohesive system boundaries and decoupled architecture.
    /// </summary>
    public interface ISchoolService
    {
        Task<IEnumerable<School>> GetSchoolsAsync();
        Task<School?> GetSchoolByIdAsync(int id);
        Task<School> CreateSchoolAsync(School school);
        Task<bool> UpdateSchoolAsync(School school);
        Task<bool> DeleteSchoolAsync(int id);
        Task<bool> SavePhotoPathAsync(int id, string path);
    }
}
