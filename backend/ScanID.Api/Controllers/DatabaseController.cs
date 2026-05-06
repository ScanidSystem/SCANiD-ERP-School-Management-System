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
            // The file was created at the root of the applet directory
            // In a real app we might store it in App_Data or similar
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "database.sql");
            
            // Check if file exists, if not check current directory (depending on where it started)
            if (!System.IO.File.Exists(filePath))
            {
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "database.sql");
            }

            if (!System.IO.File.Exists(filePath))
            {
                // Try searching for it
                return NotFound("Database script NOT found at " + filePath);
            }

            string script = System.IO.File.ReadAllText(filePath);
            return Ok(new { content = script });
        }
    }
}
