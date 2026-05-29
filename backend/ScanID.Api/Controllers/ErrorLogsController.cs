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
            // Fully optimized: Execute stored procedure for paged and sorted database error logs
            var (paginatedData, totalCount) = await _errorLogService.GetErrorLogsPagedAsync(page, pageSize, sortBy ?? "timestamp", sortOrder ?? "desc");
            
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
