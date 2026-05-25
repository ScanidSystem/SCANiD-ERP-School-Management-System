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
            // Execute decoupled service to pull logs from sp_GetAuditLogs containing a robust buffer size
            var logs = await _auditLogService.GetAuditLogsAsync(10000);
            
            // Map to Queryable for dynamic sorting, paging, and slicing
            var query = logs.AsQueryable();
            
            // Apply sorting rules safely from query criteria
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                bool isDesc = sortOrder != null && sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase);
                switch (sortBy.ToLower())
                {
                    case "timestamp":
                    case "datetime":
                    case "date":
                        query = isDesc ? query.OrderByDescending(l => l.DateTime) : query.OrderBy(l => l.DateTime);
                        break;
                    case "type":
                        query = isDesc ? query.OrderByDescending(l => l.Type) : query.OrderBy(l => l.Type);
                        break;
                    case "tablename":
                    case "entity":
                    case "entityaffected":
                        query = isDesc ? query.OrderByDescending(l => l.TableName) : query.OrderBy(l => l.TableName);
                        break;
                    case "primarykey":
                    case "uid":
                        query = isDesc ? query.OrderByDescending(l => l.PrimaryKey) : query.OrderBy(l => l.PrimaryKey);
                        break;
                    default:
                        query = isDesc ? query.OrderByDescending(l => l.DateTime) : query.OrderBy(l => l.DateTime);
                        break;
                }
            }
            else
            {
                // Fall back sorting to keep recent entries showing up first
                query = query.OrderByDescending(l => l.DateTime);
            }

            var totalCount = query.Count();
            var totalPages = (int)Math.Max(1, Math.Ceiling((double)totalCount / pageSize));
            var currentPage = Math.Max(1, page);

            var paginatedData = query.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();

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
