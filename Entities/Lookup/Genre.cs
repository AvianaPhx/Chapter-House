using Chapter_House.Entities.Bridge;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class Genre
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(60)] public string Name { get; set; } = string.Empty;

        public ICollection<BookGenre> Books { get; set; } = [];
    }
}
