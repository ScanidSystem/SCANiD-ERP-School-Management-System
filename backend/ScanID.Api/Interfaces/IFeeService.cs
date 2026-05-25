using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Interfaces
{
    /// <summary>
    /// Service Interface for Fee management operations.
    /// Supports Dependency Injection and decoupled system interactions.
    /// </summary>
    public interface IFeeService
    {
        Task<IEnumerable<Fee>> GetFeesAsync(int? studentId, int? schoolId, int? academicYearId);
        Task<bool> CreateFeeAsync(Fee fee);
    }
}
