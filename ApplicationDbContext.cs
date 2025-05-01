using Chapter_House.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chapter_House
{
    public class ApplicationDbContext : DbContext 
    {
        protected readonly IConfiguration Configuration;

        public ApplicationDbContext(IConfiguration configuration) => Configuration = configuration;

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(Configuration.GetConnectionString("DatabaseConnection"));
        }

        public DbSet<User> User { get; set; }
    }
}
