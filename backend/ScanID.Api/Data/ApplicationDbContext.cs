using Microsoft.EntityFrameworkCore;
using ScanID.Api.Models;

namespace ScanID.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<School> Schools { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Fee> Fees { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed data or configure relationships if needed
            base.OnModelCreating(modelBuilder);
        }
    }
}
