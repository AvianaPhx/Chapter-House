using Chapter_House.Entities;
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


        /* Lookup */
        public DbSet<BookFormat> BookFormats => Set<BookFormat>();
        public DbSet<BookGenre> BookGenres => Set<BookGenre>();
        public DbSet<BookPublisher> BookPublishers => Set<BookPublisher>();
        public DbSet<BookAuthor> BookAuthors => Set<BookAuthor>();

        /* Commerce */


        /* Social / Marketing */

    }
}
