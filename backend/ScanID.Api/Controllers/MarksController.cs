using Microsoft.AspNetCore.Mvc;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing student marks and academic performance.
    /// Perfectly decoupled and adheres to SOLID.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly IMarkService _markService;

        public MarksController(IMarkService markService)
        {
            _markService = markService;
        }

        /// <summary>
        /// Retrieves marks records, optionally filtered by student, school, or academic year.
        /// </summary>
        /// <param name="studentId">Optional student filter.</param>
        /// <param name="schoolId">Optional school filter.</param>
        /// <param name="academicYearId">Optional academic year filter.</param>
        /// <returns>A list of marks records.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks(int? studentId, int? schoolId, int? academicYearId)
        {
            var marks = await _markService.GetMarksAsync(studentId, schoolId, academicYearId);
            return Ok(marks);
        }

        /// <summary>
        /// Records new marks for a student.
        /// </summary>
        /// <param name="mark">The mark entry details.</param>
        /// <returns>The created mark record.</returns>
        [HttpPost]
        public async Task<ActionResult<Mark>> PostMark(Mark mark)
        {
            var success = await _markService.CreateMarkAsync(mark);
            if (!success) return StatusCode(500, "Failed to submit mark record.");
            return Ok(mark);
        }
    }
}
