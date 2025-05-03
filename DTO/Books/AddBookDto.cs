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

        public int Stock { get; set; }
        public DateTime Published { get; set; }
        public DateTime ListedAt { get; set; } = DateTime.UtcNow;
    }
}
