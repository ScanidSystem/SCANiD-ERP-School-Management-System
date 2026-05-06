using Microsoft.AspNetCore.Mvc;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for managing database-related assets like the synchronization script.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public DatabaseController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Retrieves the contents of the database synchronization script.
        /// </summary>
        /// <returns>The SQL script as text.</returns>
        [HttpGet("script")]
        public IActionResult GetScript()
        {
            return FetchScript("database.sql");
        }

        /// <summary>
        /// Retrieves the contents of the seed data script.
        /// </summary>
        /// <returns>The SQL script as text.</returns>
        [HttpGet("seed")]
        public IActionResult GetSeedScript()
        {
            return FetchScript("seed_data.sql");
        }

        private IActionResult FetchScript(string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "..", fileName);
            
            if (!System.IO.File.Exists(filePath))
            {
                filePath = Path.Combine(Directory.GetCurrentDirectory(), fileName);
            }

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"Script file '{fileName}' NOT found.");
            }

            string script = System.IO.File.ReadAllText(filePath);
            return Ok(new { content = script });
        }
    }
}
