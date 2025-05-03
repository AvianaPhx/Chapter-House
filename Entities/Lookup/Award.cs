using Chapter_House.Entities.Bridge;
using System.ComponentModel.DataAnnotations;
using static System.Reflection.Metadata.BlobBuilder;

namespace Chapter_House.Entities.Lookup
{
    public class Award
    {
        [Key] public int Id { get; set; }

        [Required] public string Name { get; set; } = string.Empty;
        public int Year { get; set; }

        public ICollection<BookAward> Books { get; set; } = [];
    }
}
