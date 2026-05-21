using Microsoft.AspNetCore.Mvc;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for retrieving system audit trails.
    /// Supports Dependency Injection and decoupled operations.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly IAuditLogService _auditLogService;

        public AuditLogsController(IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        /// <summary>
        /// Retrieves the most recent audit logs.
        /// </summary>
        /// <param name="limit">Number of records to return.</param>
        /// <returns>A list of audit logs.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs([FromQuery] int limit = 100)
        {
            var logs = await _auditLogService.GetAuditLogsAsync(limit);
            return Ok(logs);
        }
    }
}
