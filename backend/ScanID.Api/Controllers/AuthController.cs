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

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                // For security, don't reveal if user exists, but for demo we can be helpful
                return NotFound("Username not found");
            }

            // In a real app, send an email/SMS. For demo, we just return a success.
            return Ok(new { message = "Password reset instructions sent to registered email/phone" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        public string Username { get; set; } = string.Empty;
    }
}
