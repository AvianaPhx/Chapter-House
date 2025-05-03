using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Range(1,5)]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /* Foreign Keys */
        public int BookId { get; set; }
        public Book Book { get; set; } = null!;
        public long UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
