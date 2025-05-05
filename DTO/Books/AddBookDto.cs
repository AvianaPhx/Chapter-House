using Chapter_House.Entities.Enums;
using Chapter_House.Entities.Lookup;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Books
{
    public class AddBookDto
    {
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

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountedPrice { get; set; }


        // Foreign Key for Genre
        [Required]
        public int GenreId { get; set; }

        // Foreign Key for Format
        [Required]
        public int FormatId { get; set; }

        // Foreign Key for Publisher
        [Required]
        public int PublisherId { get; set; }
    }
}
