using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public enum Format
    {
        Paperback,
        Hardcover,
        Signed,
        Limited,
        FirstEdition,
        Collectors,
        AuthorsEdition,
        Deluxe
    }

    public class BookFormat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Format Format { get; set; }

        public required ICollection<Book> Books { get; set; }
    }
}
