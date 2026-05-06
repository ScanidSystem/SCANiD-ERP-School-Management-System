using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for retrieving system audit trails.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuditLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the most recent audit logs.
        /// </summary>
        /// <param name="limit">Number of records to return.</param>
        /// <returns>A list of audit logs.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs([FromQuery] int limit = 100)
        {
            return await _context.AuditLogs
                .OrderByDescending(x => x.DateTime)
                .Take(limit)
                .ToListAsync();
        }
    }
}
