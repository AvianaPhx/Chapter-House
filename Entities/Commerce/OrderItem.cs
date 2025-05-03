using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Commerce
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int BookId { get; set; }
        public Book Book { get; set; } = null!;
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
    }
}
