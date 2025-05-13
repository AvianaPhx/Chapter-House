using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Core
{
    public class Whitelist
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int BookId { get; set; }
        public Book Book { get; set; } = null!;
    }
}
