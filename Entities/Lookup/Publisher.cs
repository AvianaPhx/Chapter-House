using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class Publisher
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(120)] public string Name { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = [];
    }
}
