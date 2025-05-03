using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Commerce
{
    public class CartItem
    {
        [Key] public int Id { get; set; }

        public int UserId { get; set; }
        public int BookId { get; set; }

        [Range(1, int.MaxValue)] public int Quantity { get; set; }

        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
