using Chapter_House.Entities;
using Chapter_House.Entities.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Chapter_House
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        private readonly IConfiguration _config;

        public ApplicationDbContext(IConfiguration config) => _config = config;

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseNpgsql(_config.GetConnectionString("DatabaseConnection"));

        /* Core */
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Whitelist> Whitelists => Set<Whitelist>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();


        /* Social / Marketing */
        public DbSet<Banner> Banners => Set<Banner>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Seed roles
            builder.Entity<IdentityRole<int>>().HasData(
                new IdentityRole<int>
                {
                    Id = 1,
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole<int>
                {
                    Id = 2,
                    Name = "Staff",
                    NormalizedName = "STAFF"
                },
                new IdentityRole<int>
                {
                    Id = 3,
                    Name = "Member",
                    NormalizedName = "MEMBER"
                }
            );
        }
    }
}