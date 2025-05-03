using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.Entities.Core
{
    public class Order
    {
        [Key] public int Id { get; set; }

        public int UserId { get; set; }
        public DateTime PlacedAt { get; set; } = DateTime.UtcNow;
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Column(TypeName="decimal(10,2)")] public decimal Subtotal { get; set; }
        [Column(TypeName = "decimal(10,2)")] public decimal DiscountTotal { get; set; }
        [Column(TypeName = "decimal(10,2)")] public decimal GrandTotal { get; set; }

        public User User { get; set; } = null!;
        public ICollection<OrderItem> Items { get; set; } = [];
    }

    public class OrderItem
    {
        [Key] public int Id { get; set; }

        public int OrderId { get; set; }
        public int BookId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(10,2)")] public decimal UnitPrice { get; set; }

        public Order Order { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
