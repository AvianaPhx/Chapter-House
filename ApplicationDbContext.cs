using Chapter_House.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chapter_House
{
    public class ApplicationDbContext : DbContext 
    {
        private readonly IConfiguration _config;
        public ApplicationDbContext(IConfiguration config) => _config = config;

        protected override void OnConfiguring(DbContextOptionsBuilder options) 
            => options.UseNpgsql(_config.GetConnectionString("DatabaseConnection"));
        

        public DbSet<User> Users { get; set; }
    }
}
