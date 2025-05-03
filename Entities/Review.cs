using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities
{
    public class Review
    {
        [Key] public int Id {get; set; }

        public int UserId{get; set; }
        public int BookId{get; set; }

        [Range(1,5)] public int Rating { get; set; }
        [MaxLength(1000)] public string? Comment { get; set; }

        public DateTime ReviewedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
