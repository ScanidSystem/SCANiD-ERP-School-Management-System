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
                var query = _context.NavigationItems
                    .Include(n => n.NavigationRoles)
                    .ThenInclude(nr => nr.Role)
                    .Where(n => n.IsActive);

                var items = await query.ToListAsync();

                // If the NavigationItems table is empty, return a default set
                if (items.Count == 0)
                {
                    return Ok(new { data = GetDefaultNavigationItems() });
                }

                // Map to a format the frontend expects
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
                if (!string.IsNullOrEmpty(role) && role.ToLower() != "all")
                {
                    var lowerRole = role.ToLower().Replace(" ", "");
                    
                    // SuperAdmin gets everything
                    if (lowerRole == "superadmin")
                    {
                        return Ok(new { data = result });
                    }

                    // For other roles, filter based on roles array
                    var filtered = result.Where(i => 
                        i.roles.Contains(lowerRole) || i.roles.Contains("all")
                    ).ToList();

                    // If filtered results are empty, it might mean the role mapping in DB is missing.
                    // Fallback to default mock items for that role to ensure UI doesn't break.
                    if (filtered.Count == 0)
                    {
                        var defaults = GetDefaultNavigationItems()
                            .Cast<dynamic>()
                            .Where(x => ((string[])x.roles).Contains(lowerRole) || ((string[])x.roles).Contains("all"))
                            .ToList();
                        
                        if (defaults.Count > 0)
                        {
                            return Ok(new { data = defaults });
                        }
                    }

                    return Ok(new { data = filtered });
                }

                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                // Absolute fallback on error
                return Ok(new { data = GetDefaultNavigationItems(), error = ex.Message });
            }
        }

        private List<object> GetDefaultNavigationItems()
        {
            return new List<object>
            {
                new { id = 1, title = "Dashboard", icon = "LayoutDashboard", path = "/", parentId = (int?)null, sortOrder = 1, roles = new[] { "superadmin", "admin", "teacher", "parent", "student" } },
                
                // Academic Operations Group
                new { id = 1000, title = "Academic Operations", icon = "BookOpen", path = (string?)null, parentId = (int?)null, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 11, title = "Student Registry", icon = "GraduationCap", path = "/students", parentId = 1000, sortOrder = 1, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 12, title = "Attendance Tracking", icon = "CalendarCheck", path = "/attendance", parentId = 1000, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher" } },
                new { id = 13, title = "Examination & Marks", icon = "BarChart3", path = "/marks", parentId = 1000, sortOrder = 3, roles = new[] { "superadmin", "admin", "teacher" } },
                
                // Staff & HR Group
                new { id = 2000, title = "Staff & HR", icon = "Users", path = (string?)null, parentId = (int?)null, sortOrder = 3, roles = new[] { "superadmin", "admin" } },
                new { id = 21, title = "Teacher Catalog", icon = "UserCheck", path = "/teachers", parentId = 2000, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                new { id = 22, title = "Manage Users", icon = "UserPlus", path = "/configuration/users", parentId = 2000, sortOrder = 2, roles = new[] { "superadmin", "admin" } },
                
                // Administrative Group
                new { id = 3000, title = "Administrative", icon = "ShieldCheck", path = (string?)null, parentId = (int?)null, sortOrder = 4, roles = new[] { "superadmin", "admin", "teacher", "parent" } },
                new { id = 31, title = "Fee Management", icon = "CreditCard", path = "/fees", parentId = 3000, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                new { id = 32, title = "Communication Hub", icon = "MessageSquare", path = "/messages", parentId = 3000, sortOrder = 2, roles = new[] { "superadmin", "admin", "teacher", "parent" } },
                
                // Masters & Config Group
                new { id = 4000, title = "Masters & Config", icon = "Database", path = "/configuration", parentId = (int?)null, sortOrder = 5, roles = new[] { "superadmin", "admin" } },
                new { id = 41, title = "Global Schools", icon = "School", path = "/configuration/schools", parentId = 4000, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                
                // RBAC Sub-group
                new { id = 42, title = "Access Control (RBAC)", icon = "Key", path = (string?)null, parentId = 4000, sortOrder = 2, roles = new[] { "superadmin", "admin" } },
                new { id = 421, title = "Role Master", icon = "Shield", path = "/configuration/role-master", parentId = 42, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                new { id = 422, title = "Role Assignment", icon = "UserCheck", path = "/configuration/role-assignment", parentId = 42, sortOrder = 2, roles = new[] { "superadmin", "admin" } },
                
                // Menu Designer Sub-group
                new { id = 43, title = "Menu Designer", icon = "Layout", path = (string?)null, parentId = 4000, sortOrder = 3, roles = new[] { "superadmin", "admin" } },
                new { id = 431, title = "Navigation Builder", icon = "LayoutGrid", path = "/configuration/navigation", parentId = 43, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                
                // Academic Masters Sub-group
                new { id = 44, title = "Academic Masters", icon = "BookOpen", path = (string?)null, parentId = 4000, sortOrder = 4, roles = new[] { "superadmin", "admin" } },
                new { id = 441, title = "Standards & Grades", icon = "Layers", path = "/configuration/standards", parentId = 44, sortOrder = 1, roles = new[] { "superadmin", "admin" } },
                new { id = 442, title = "Divisions/Sections", icon = "Hash", path = "/configuration/sections", parentId = 44, sortOrder = 2, roles = new[] { "superadmin", "admin" } },
                new { id = 443, title = "Academic Years", icon = "Calendar", path = "/configuration/academic-years", parentId = 44, sortOrder = 3, roles = new[] { "superadmin", "admin" } },
                new { id = 444, title = "Subject Registry", icon = "BookOpen", path = "/configuration/subjects", parentId = 44, sortOrder = 4, roles = new[] { "superadmin", "admin" } },
                
                // System Audit
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
