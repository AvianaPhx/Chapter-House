using Chapter_House.Entities;
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

        /* Core */
        public DbSet<User> Users => Set<User>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<BookDiscount> BookDiscounts => Set<BookDiscount>();
        public DbSet<BookOrderHistory> BookOrderHistories => Set<BookOrderHistory>();
        public DbSet<Whitelist> whitelists => Set<Whitelist>();


        /* Lookup */
        public DbSet<BookFormat> BookFormats => Set<BookFormat>();
        public DbSet<BookGenre> BookGenres => Set<BookGenre>();
        public DbSet<BookPublisher> BookPublishers => Set<BookPublisher>();




        /* Commerce */
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();


        /* Social / Marketing */
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Banner> Banners => Set<Banner>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);



            /* Composite Primary Key for BookGenre */
            b.Entity<BookGenre>()
                .HasKey(bg => bg.Id);

            /* Relationship: Book - BookDiscount (One-to-Many) */
            b.Entity<BookDiscount>()
                .HasOne(bd => bd.Book)
                .WithMany(b => b.BookDiscounts)
                .HasForeignKey(bd => bd.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            /* Relationship: OrderItem - Order (One-to-Many) */
            b.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            /* Relationship: OrderItem - Book (Many-to-One) */
            b.Entity<OrderItem>()
                .HasOne(oi => oi.Book)
                .WithMany()
                .HasForeignKey(oi => oi.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            /* Relationship: Order - User (One-to-Many) */
            b.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            /* Relationship: Review - Book (Many-to-One) */
            b.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            /* Relationship: Review - User (Many-to-One) */
            b.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            /* Relationship: Whitelist - Book and User (Many-to-One) */
            b.Entity<Whitelist>()
                .HasOne(w => w.Book)
                .WithMany()
                .HasForeignKey(w => w.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Whitelist>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);


            b.Entity<BookPublisher>().HasIndex(bp => bp.PublisherName).IsUnique();
            b.Entity<BookFormat>().HasIndex(bf => bf.Format).IsUnique();
            b.Entity<Whitelist>().HasIndex(w => new { w.UserId, w.BookId }).IsUnique();
            b.Entity<Review>().HasIndex(r => new { r.UserId, r.BookId }).IsUnique();


            b.Entity<Book>()
                .HasOne(b => b.Format)
                .WithMany(f => f.Books)
                .HasForeignKey(b => b.FormatId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Book>()
                .HasOne(b => b.Genre)
                .WithMany(g => g.Books)
                .HasForeignKey(b => b.GenreId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}   
