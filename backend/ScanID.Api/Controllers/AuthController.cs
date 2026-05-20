using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    /// <summary>
    /// Controller for authentication and user sessions.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Authenticates a user based on username and password.
        /// </summary>
        /// <param name="request">Login credentials.</param>
        /// <returns>User profile data on success.</returns>
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

            // Helper to get RoleId from Role name string if not explicitly set
            int roleId = user.RoleId ?? (user.Role?.ToLower() switch
            {
                "superadmin" => 1,
                "admin" => 2,
                "teacher" => 3,
                "student" => 4,
                "parent" => 5,
                _ => 4 // Default to student
            });

            return Ok(new {
                id = user.Id.ToString(),
                name = user.Name,
                role = user.Role ?? "student",
                roleId = roleId,
                schoolId = user.SchoolId?.ToString(),
                schoolName = user.School?.Name
            });
        }

        /// <summary>
        /// Initiates a password reset process for a user.
        /// </summary>
        /// <param name="request">The request containing the username.</param>
        /// <returns>Success message.</returns>
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

    /// <summary>
    /// DTO for login request.
    /// </summary>
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for forgot password request.
    /// </summary>
    public class ForgotPasswordRequest
    {
        public string Username { get; set; } = string.Empty;
    }

}
