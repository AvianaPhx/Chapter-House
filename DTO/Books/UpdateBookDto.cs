using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Books
{
    public class UpdateBookDto
    {
        public string? Title { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        [StringLength(13, MinimumLength = 13)] public required string Isbn { get; set; }

        [Required]
        public int Stock { get; set; }
        public bool OnSale { get; set; }
        public DateTime Published { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountedPercentage { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime DiscountStartDate { get; set; }
        public DateTime DiscountEndDate { get; set; }

        public string? Language { get; set; }

        public string? GenreName { get; set; }
        public string? FormatName { get; set; }
        public string? AuthorName { get; set; }
        public string? PublisherName { get; set; }

    }
}
