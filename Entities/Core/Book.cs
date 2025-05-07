using Chapter_House.Entities.Lookup;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Chapter_House.Entities.Core
{
    public class Book
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        [StringLength(13, MinimumLength = 13)] public required string Isbn { get; set; }

        [Required]
        public int Stock { get; set; }
        public bool OnSale { get; set; }
        public DateTime Published { get; set; }
        public DateTime ListedAt { get; set; } = DateTime.UtcNow;

        [Range(1, 5)]
        public decimal Rating { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DiscountedPercentage { get; set; }

        public decimal? TotalPrice { get; set; }

        public DateTime? DiscountStartDate { get; set; } // Either today or choose date from frontend
        public DateTime? DiscountEndDate { get; set; }
        public string? Language { get; set; }


        [Required]
        [ForeignKey(nameof(BookGenre))]
        public int GenreId { get; set; }
        [JsonIgnore]
        public BookGenre? Genre { get; set; }


        [Required]
        [ForeignKey(nameof(BookFormat))]
        public int FormatId { get; set; }
        [JsonIgnore]
        public BookFormat? Format { get; set; }

        
        [Required]
        [ForeignKey(nameof(BookPublisher))]
        public int PublisherId { get; set; }
        [JsonIgnore]
        public BookPublisher? Publisher { get; set; }


        [Required]
        [ForeignKey(nameof(BookAuthor))]
        public int AuthorId { get; set; }
        [JsonIgnore]
        public BookAuthor? Author { get; set; }

    }
}
