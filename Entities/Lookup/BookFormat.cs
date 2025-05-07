using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class BookFormat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string FormatName { get; set; }

        public ICollection<Book>? Books { get; set; }
    }
}