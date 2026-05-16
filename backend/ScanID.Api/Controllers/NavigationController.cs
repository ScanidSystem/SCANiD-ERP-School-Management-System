using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanID.Api.Data;
using ScanID.Api.Models;

namespace ScanID.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NavigationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetNavigations([FromQuery] string? role)
        {
            try
            {
                // If the NavigationItems table is empty, return a default set to ensure the app works
                if (!await _context.NavigationItems.AnyAsync())
                {
                    return Ok(new { data = GetDefaultNavigationItems() });
                }

                var query = _context.NavigationItems
                    .Include(n => n.NavigationRoles!)
                    .ThenInclude(nr => nr.Role)
                    .Where(n => n.IsActive);

                var items = await query.ToListAsync();

                // Map to a format the frontend expects (including roles as a string array)
                var result = items.Select(i => new {
                    i.Id,
                    i.Title,
                    i.Icon,
                    i.Path,
                    i.ParentId,
                    i.SortOrder,
                    roles = i.NavigationRoles.Select(nr => nr.Role?.Name.ToLower().Replace(" ", "") ?? "all").ToArray()
                }).OrderBy(i => i.SortOrder).ToList();

                // Filter by role if provided
                if (!string.IsNullOrEmpty(role) && role != "all")
                {
                    // SuperAdmin gets everything
                    if (role.ToLower() == "superadmin")
                    {
                        return Ok(new { data = result });
                    }

                    // For other roles, filter based on roles array
                    var filtered = result.Where(i => 
                        i.roles.Contains(role.ToLower()) || i.roles.Contains("all")
                    ).ToList();

                    return Ok(new { data = filtered });
                }

                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return Ok(new { data = GetDefaultNavigationItems(), error = ex.Message });
            }
        }

        private List<object> GetDefaultNavigationItems()
        {
            return new List<object>
            {
                new { id = 1, title = "Dashboard", icon = "LayoutDashboard", path = "/", parentId = (int?)null, sortOrder = 1, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 1000, title = "Academic Operations", icon = "BookOpen", path = (string?)null, parentId = (int?)null, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 11, title = "Student Registry", icon = "GraduationCap", path = "/students", parentId = 1000, sortOrder = 1, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 12, title = "Attendance Tracking", icon = "CalendarCheck", path = "/attendance", parentId = 1000, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 13, title = "Examination & Marks", icon = "BarChart3", path = "/marks", parentId = 1000, sortOrder = 3, roles = new[] { "superadmin", "admin", "teacher" } },
                
                new { id = 2000, title = "Staff & HR", icon = "Users", path = (string?)null, parentId = (int?)null, sortOrder = 3, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 21, title = "Teacher Catalog", icon = "UserCheck", path = "/teachers", parentId = 2000, sortOrder = 1, roles = new[] { "superadmin", "admin", "teacher" } },
                
                new { id = 3000, title = "Administrative", icon = "ShieldCheck", path = (string?)null, parentId = (int?)null, sortOrder = 4, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 31, title = "Fee Management", icon = "CreditCard", path = "/fees", parentId = 3000, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                new { id = 32, title = "Communication Hub", icon = "MessageSquare", path = "/messages", parentId = 3000, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher" } },
                
                new { id = 4000, title = "Masters & Config", icon = "Database", path = "/configuration", parentId = (int?)null, sortOrder = 5, roles = new[] { "superadmin", "admin" } },
                new { id = 41, title = "Global Schools", icon = "School", path = "/configuration/schools", parentId = 4000, sortOrder = 1, roles = new[] { "superadmin" } },
                new { id = 42, title = "Access Control (RBAC)", icon = "Key", path = "/role-assignment", parentId = 4000, sortOrder = 2, roles = new[] { "superadmin" } },
                new { id = 43, title = "Menu Designer", icon = "Layout", path = "/navigation-management", parentId = 4000, sortOrder = 3, roles = new[] { "superadmin" } },
                new { id = 44, title = "Academic Masters", icon = "BookOpen", path = "/configuration/masters", parentId = 4000, sortOrder = 4, roles = new[] { "superadmin", "admin" } },
                
                new { id = 5000, title = "System Audit", icon = "Terminal", path = "/system-logs", parentId = (int?)null, sortOrder = 6, roles = new[] { "superadmin" } }
            };
        }

        [HttpPost]
        public async Task<ActionResult<NavigationItem>> CreateNavigation(NavigationItem item)
        {
            _context.NavigationItems.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNavigations), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNavigation(int id, NavigationItem item)
        {
            if (id != item.Id) return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNavigation(int id)
        {
            var item = await _context.NavigationItems.FindAsync(id);
            if (item == null) return NotFound();
            _context.NavigationItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
