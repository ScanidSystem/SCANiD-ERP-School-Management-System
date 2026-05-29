using Microsoft.AspNetCore.Mvc;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
        /// Retrieves the audit logs under full server-side pagination, sorting, and filtering.
        /// </summary>
        /// <param name="page">The 1-indexed page number loaded dynamically.</param>
        /// <param name="pageSize">Amount of logs in each layout slice.</param>
        /// <param name="sortBy">The field determining ordering, e.g. timestamp, type, tableName.</param>
        /// <param name="sortOrder">Sort progression rule: 'asc' or 'desc'.</param>
        /// <returns>A paginated logs matching filters.</returns>
        [HttpGet]
        public async Task<ActionResult> GetAuditLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "timestamp",
            [FromQuery] string sortOrder = "desc")
        {
            // Fully optimized: Execute stored procedure for paged, sorted, and filtered audit trails
            var (paginatedData, totalCount) = await _auditLogService.GetAuditLogsPagedAsync(page, pageSize, sortBy ?? "timestamp", sortOrder ?? "desc");
            
            var totalPages = (int)Math.Max(1, Math.Ceiling((double)totalCount / pageSize));
            var currentPage = Math.Max(1, page);

            // Return standardized paginated envelope
            return Ok(new
            {
                data = paginatedData,
                pagination = new
                {
                    totalCount,
                    totalPages,
                    page = currentPage,
                    pageSize
                }
            });
        }
    }
}
