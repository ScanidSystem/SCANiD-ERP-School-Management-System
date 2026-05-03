using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.School)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || user.PasswordHash != request.Password) // Simple check for demo
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok(new {
                id = user.Id.ToString(),
                name = user.FullName,
                role = user.Role,
                schoolId = user.SchoolId?.ToString(),
                schoolName = user.School?.Name
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
