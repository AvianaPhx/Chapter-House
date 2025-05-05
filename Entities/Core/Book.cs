
using Chapter_House.Entities.Commerce;
using Chapter_House.Entities.Lookup;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chapter_House.Entities.Core
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Author { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [StringLength(13, MinimumLength = 13)]
        public required string Isbn { get; set; }

        [Required]
        public int Stock { get; set; }

        public bool OnSale { get; set; }

        public DateTime Published { get; set; }
        public DateTime ListedAt { get; set; } = DateTime.UtcNow;

        [Range(1, 5)]
        public decimal Rating { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountedPrice { get; set; }


        // Foreign Key Genre
        [Required]
        public int GenreId { get; set; }
        public required BookGenre Genre { get; set; }

        // Foreign Key Format
        [Required]
        public int FormatId { get; set; }
        public required BookFormat Format { get; set; }

        // Foreign Key Publisher
        [Required]
        public int PublisherId { get; set; }
        public required BookPublisher Publisher { get; set; }

        public ICollection<BookDiscount> BookDiscounts { get; set; } = new List<BookDiscount>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
