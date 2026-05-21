using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for student marks and performance.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface IMarkService
    {
        Task<IEnumerable<Mark>> GetMarksAsync(int? studentId, int? schoolId, int? academicYearId);
        Task<bool> CreateMarkAsync(Mark mark);
    }
}
