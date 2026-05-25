using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Interfaces;
using ScanID.Api.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for retrieving system error logs.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorLogsController : ControllerBase
    {
        private readonly IErrorLogService _errorLogService;

        public ErrorLogsController(IErrorLogService errorLogService)
        {
            _errorLogService = errorLogService;
        }

        /// <summary>
        /// Retrieves the error logs under full server-side pagination, sorting, and filtering.
        /// </summary>
        /// <param name="page">The 1-indexed page number loaded dynamically.</param>
        /// <param name="pageSize">Amount of logs in each layout slice.</param>
        /// <param name="sortBy">The field determining ordering, e.g. timestamp, level, properties.</param>
        /// <param name="sortOrder">Sort progression rule: 'asc' or 'desc'.</param>
        /// <returns>A paginated logs matching filters.</returns>
        [HttpGet]
        public async Task<ActionResult> GetErrorLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "timestamp",
            [FromQuery] string sortOrder = "desc")
        {
            // Execute decoupled service to pull logs from sp_GetErrorLogs containing a robust buffer size
            var logs = await _errorLogService.GetErrorLogsAsync(10000);
            
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
                    case "time":
                        query = isDesc ? query.OrderByDescending(e => e.Timestamp) : query.OrderBy(e => e.Timestamp);
                        break;
                    case "level":
                    case "severity":
                        query = isDesc ? query.OrderByDescending(e => e.Level) : query.OrderBy(e => e.Level);
                        break;
                    case "properties":
                    case "origin":
                        query = isDesc ? query.OrderByDescending(e => e.Properties) : query.OrderBy(e => e.Properties);
                        break;
                    default:
                        query = isDesc ? query.OrderByDescending(e => e.Timestamp) : query.OrderBy(e => e.Timestamp);
                        break;
                }
            }
            else
            {
                // Fall back sorting to keep recent entries showing up first
                query = query.OrderByDescending(e => e.Timestamp);
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

        /// <summary>
        /// Clears all error logs from the database.
        /// </summary>
        /// <returns>No content on success.</returns>
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearLogs()
        {
            await _errorLogService.ClearErrorLogsAsync();
            return NoContent();
        }

        /// <summary>
        /// Retrieves human-readable logs from the server filesystem.
        /// </summary>
        /// <returns>Log file content as text.</returns>
        [HttpGet("filesystem")]
        public IActionResult GetFileSystemLogs()
        {
            try
            {
                string logDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
                if (!Directory.Exists(logDirectory)) return Ok(new { content = "No log directory found." });

                var files = Directory.GetFiles(logDirectory, "app_log_*.txt");
                if (files.Length == 0) return Ok(new { content = "No log files found yet." });

                // Get the most recent one
                var latestFile = files.OrderByDescending(f => f).First();
                string content = System.IO.File.ReadAllText(latestFile);
                return Ok(new { content });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error reading logs: {ex.Message}");
            }
        }
    }
}
