using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class BookGenre
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string GenreName { get; set; } = string.Empty;

        public required ICollection<Book> Books { get; set; }
    }
}
