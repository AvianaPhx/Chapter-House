using Chapter_House.Entities;
using Chapter_House.Entities.Bridge;
using Chapter_House.Entities.Commerce;
using Chapter_House.Entities.Core;
using Chapter_House.Entities.Lookup;
using Microsoft.EntityFrameworkCore;

namespace Chapter_House
{
    public class ApplicationDbContext : DbContext 
    {
        private readonly IConfiguration _config;
        public ApplicationDbContext(IConfiguration config) => _config = config;

        protected override void OnConfiguring(DbContextOptionsBuilder options) 
            => options.UseNpgsql(_config.GetConnectionString("DatabaseConnection"));

        /* DbSets */
        public DbSet<User> Users => Set<User>();
        public DbSet<Book> Books => Set<Book>();

        /* Lookup */
        public DbSet<Publisher> Publishers => Set<Publisher>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Award> Awards => Set<Award>();

        /* bridge */
        public DbSet<BookGenre> BookGenres => Set<BookGenre>();
        public DbSet<BookAward> BookAwards => Set<BookAward>();

        /* Commerce */
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Whitelist> Whitelists => Set<Whitelist>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Discount> Discounts => Set<Discount>();

        /* Social / Marketing */
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Banner> Banners => Set<Banner>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            /* Composite primary keys for the two bridge tables */
            b.Entity<BookGenre>().HasKey(bg => new { bg.BookId, bg.GenreId });

            b.Entity<BookAward>().HasKey(ba => new { ba.BookId, ba.AwardId });

            /* Useful uniqueness & search indices */
            b.Entity<Publisher>().HasIndex(p => p.Name).IsUnique();

            b.Entity<Genre>().HasIndex(g => g.Name).IsUnique();

            b.Entity<CartItem>().HasIndex(c => new { c.UserId, c.BookId }).IsUnique();
            b.Entity<Whitelist>().HasIndex(w => new { w.UserId, w.BookId }).IsUnique();
            b.Entity<Review>().HasIndex(r => new { r.UserId, r.BookId }).IsUnique();

            //  ⬇ NEW: Book ↔ Discount (one-to-many)


            b.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId);
        }
        
    }
}
