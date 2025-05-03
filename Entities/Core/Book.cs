using Chapter_House.Entities.Bridge;
using Chapter_House.Entities.Commerce;
using Chapter_House.Entities.Enums;
using Chapter_House.Entities.Lookup;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chapter_House.Entities.Core
{
    public class Book
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(150)] public string Title { get; set; } = string.Empty;

        [Required, MaxLength(100)] public string Author { get; set; } = string.Empty;


        /* Look-Ups */
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; } = null!;

        public BookFormat Format { get; set; } = BookFormat.Paperback;
        public string Language { get; set; } = "en";


        /* ISBN & description */
        [MaxLength(13)] public string? Isbn { get; set; }
        public string? Description { get; set; }

        /* Media / Images */
        public string? CoverUrl { get; set; }

        /* Media / Images */
        public DateTime? Published { get; set; }
        public DateTime ListedAt { get; set; } = DateTime.UtcNow;

        /* Pricing/ promo */
        [Column(TypeName = "decimal(10,2)")] public decimal Price { get; set; }
        public bool OnSale { get; set; }

        /* Pricing/ promo */
        public int Stock { get; set; }
        public bool IsReferenceOnly { get; set; }

        /* Analytics / Tabs */
        public int SoldCount { get; set; }
        public double AverageRating { get; set; }
        public int RatingCount { get; set; }

        /* Navigation Collections */
        public ICollection<BookGenre> Genres { get; set; } = [];
        public ICollection<BookAward> Awards { get; set; } = [];


        /* Navigation collections */
        public ICollection<OrderItem> OrderItems { get; set; } = [];
        public ICollection<CartItem> CartItems { get; set; } = [];
        public ICollection<Whitelist> Whitelists { get; set; } = [];
        public ICollection<Review> Reviews { get; set; } = [];
    }
}
