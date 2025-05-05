using Chapter_House.Entities.Core;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chapter_House.Entities.Commerce
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key Order
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        // Foreign Key Book
        public int BookId { get; set; }
        public Book Book { get; set; } = null!;

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public decimal TotalAmount => Quantity * Price;
    }
}
