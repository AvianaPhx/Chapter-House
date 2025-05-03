using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Commerce
{
    public class Whitelist
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }

        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
