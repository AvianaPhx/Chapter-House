using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class BookAuthor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string AuthorName { get; set; }

        public ICollection<Book>? Books { get; set; }
    }
}
