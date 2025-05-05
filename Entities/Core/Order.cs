using Chapter_House.Entities.Commerce;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.Entities.Core
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string ClaimCode { get; set; } = string.Empty;
        public bool Cancelled { get; set; }
        public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

        /* Foreign Keys */
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        /* Foreign Keys */
        public int? DiscountId { get; set; }
        public BookDiscount DiscountPercentage { get; set; } = null!;


        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount => Items.Sum(item => item.TotalAmount);
    }
}
