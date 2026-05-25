using Microsoft.AspNetCore.Mvc;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student fee records.
    /// Perfectly decoupled and adheres to SOLID.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FeesController : ControllerBase
    {
        private readonly IFeeService _feeService;

        public FeesController(IFeeService feeService)
        {
            _feeService = feeService;
        }

        /// <summary>
        /// Retrieves fee records, optionally filtered by student, school, or academic year.
        /// </summary>
        /// <param name="studentId">Optional student filter.</param>
        /// <param name="schoolId">Optional school filter.</param>
        /// <param name="academicYearId">Optional academic year filter.</param>
        /// <returns>A list of fee entries.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fee>>> GetFees(int? studentId, int? schoolId, int? academicYearId)
        {
            var fees = await _feeService.GetFeesAsync(studentId, schoolId, academicYearId);
            return Ok(fees);
        }

        /// <summary>
        /// Records a new fee entry or payment.
        /// </summary>
        /// <param name="fee">The fee details.</param>
        /// <returns>The created fee record.</returns>
        [HttpPost]
        public async Task<ActionResult<Fee>> PostFee(Fee fee)
        {
            var success = await _feeService.CreateFeeAsync(fee);
            if (!success) return StatusCode(500, "Failed to submit fee record.");
            return Ok(fee);
        }
    }
}
