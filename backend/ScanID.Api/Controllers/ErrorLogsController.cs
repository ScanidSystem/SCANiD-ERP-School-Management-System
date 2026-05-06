using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for retrieving system error logs.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ErrorLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the most recent error logs.
        /// </summary>
        /// <param name="limit">Number of records to return.</param>
        /// <returns>A list of error logs.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ErrorLog>>> GetErrorLogs([FromQuery] int limit = 100)
        {
            return await _context.ErrorLogs
                .OrderByDescending(x => x.Timestamp)
                .Take(limit)
                .ToListAsync();
        }

        /// <summary>
        /// Clears all error logs from the database.
        /// </summary>
        /// <returns>No content on success.</returns>
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearLogs()
        {
            _context.ErrorLogs.RemoveRange(_context.ErrorLogs);
            await _context.SaveChangesAsync();
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
