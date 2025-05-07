using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Core
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public ICollection<CartItem>? CartItems { get; set; }
    }
}
