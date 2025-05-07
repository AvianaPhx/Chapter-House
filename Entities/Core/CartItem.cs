using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Core
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int CartId { get; set; } 

        public virtual Cart? Cart { get; set; }

        public int BookId { get; set; } 

        public virtual Book? Book { get; set; }

        public int Quantity { get; set; }
    }
}
